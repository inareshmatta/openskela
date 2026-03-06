import { OpenSkeleaError } from './types';
import type { Agent, AgentConfig, AgentRunResult } from './agent';

export interface SpawnConfig {
    maxDepth: number;
    maxConcurrentChildren: number;
}

export interface SpawnRequest {
    name: string;
    task: string;
    tools?: string[];
    autoTerminate?: boolean;
    onComplete?: (result: AgentRunResult) => void;
}

export class Tracer {
    recordSpawn(parentId: string, childId: string) {
        console.log(`[Tracer] Agent ${parentId} spawned child ${childId}`);
    }
}

export class CostTracker {
    recordCost(amount: number) {
        // track cost across the spawn tree
    }
}

export interface AgentFactory {
    create(config: AgentConfig, spawner: AgentSpawner): Agent;
}

// Simple chunk function
function chunk<T>(array: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export class AgentSpawner {
    private children: Map<string, Agent> = new Map()
    private _childCount = 0
    private spawnTree: Record<string, string[]> = {}  // parentId → childIds[]

    constructor(
        private parentAgentId: string,
        private currentDepth: number,
        private config: SpawnConfig,
        private agentFactory: AgentFactory,
        private costTracker: CostTracker,
        private tracer: Tracer
    ) { }

    get childCount(): number { return this._childCount }
    getTree(): Record<string, string[]> { return this.spawnTree }

    async spawn(parent: Agent, request: SpawnRequest): Promise<AgentRunResult> {
        this.validateDepth()
        this.validateConcurrency()
        this.validateCostBudget()

        const childConfig = this.buildChildConfig(parent.config, request)
        const childSpawner = new AgentSpawner(
            childConfig.id,
            this.currentDepth + 1,
            this.config,
            this.agentFactory,
            this.costTracker,
            this.tracer
        )

        const child = this.agentFactory.create(childConfig, childSpawner)
        const childSessionId = `${parent.config.id}_child_${Date.now()}`

        this.children.set(childConfig.id, child)
        this._childCount++
        this.spawnTree[this.parentAgentId] = [
            ...(this.spawnTree[this.parentAgentId] ?? []), childConfig.id
        ]
        this.tracer.recordSpawn(this.parentAgentId, childConfig.id)

        try {
            const result = await child.run(request.task, childSessionId)
            if (request.onComplete) request.onComplete(result)
            return result
        } finally {
            if (request.autoTerminate !== false) this.terminate(childConfig.id)
        }
    }

    async spawnMany(parent: Agent, requests: SpawnRequest[]): Promise<AgentRunResult[]> {
        const batches = chunk(requests, this.config.maxConcurrentChildren)
        const results: AgentRunResult[] = []
        for (const batch of batches) {
            results.push(...await Promise.all(batch.map(r => this.spawn(parent, r))))
        }
        return results
    }

    async fanOut(parent: Agent, task: string, subtasks: string[], tools?: string[]): Promise<string> {
        const results = await this.spawnMany(
            parent,
            subtasks.map((t, i) => ({ name: `worker_${i}`, task: t, tools, autoTerminate: true }))
        )
        return results.map(r => r.text).join('\n\n---\n\n')
    }

    private buildChildConfig(parentConfig: AgentConfig, request: SpawnRequest): AgentConfig {
        return {
            ...parentConfig,
            id: `agent_${Math.random().toString(36).substr(2, 9)}`,
            name: request.name,
            tools: request.tools ?? parentConfig.tools
        }
    }

    private validateDepth(): void {
        if (this.currentDepth >= this.config.maxDepth) {
            throw new OpenSkeleaError('MAX_SPAWN_DEPTH',
                `Cannot spawn beyond depth ${this.config.maxDepth}`)
        }
    }

    private validateConcurrency(): void {
        if (this.children.size >= this.config.maxConcurrentChildren) {
            throw new OpenSkeleaError('MAX_CONCURRENT_CHILDREN',
                `Cannot run more than ${this.config.maxConcurrentChildren} concurrent child agents`)
        }
    }

    private validateCostBudget(): void {
        // Check remaining spawn tree budget
    }

    private terminate(childId: string): void {
        this.children.delete(childId)
    }
}
