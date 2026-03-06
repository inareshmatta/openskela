"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentSpawner = exports.CostTracker = exports.Tracer = void 0;
const types_1 = require("./types");
class Tracer {
    recordSpawn(parentId, childId) {
        console.log(`[Tracer] Agent ${parentId} spawned child ${childId}`);
    }
}
exports.Tracer = Tracer;
class CostTracker {
    recordCost(amount) {
        // track cost across the spawn tree
    }
}
exports.CostTracker = CostTracker;
// Simple chunk function
function chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
class AgentSpawner {
    parentAgentId;
    currentDepth;
    config;
    agentFactory;
    costTracker;
    tracer;
    children = new Map();
    _childCount = 0;
    spawnTree = {}; // parentId → childIds[]
    constructor(parentAgentId, currentDepth, config, agentFactory, costTracker, tracer) {
        this.parentAgentId = parentAgentId;
        this.currentDepth = currentDepth;
        this.config = config;
        this.agentFactory = agentFactory;
        this.costTracker = costTracker;
        this.tracer = tracer;
    }
    get childCount() { return this._childCount; }
    getTree() { return this.spawnTree; }
    async spawn(parent, request) {
        this.validateDepth();
        this.validateConcurrency();
        this.validateCostBudget();
        const childConfig = this.buildChildConfig(parent.config, request);
        const childSpawner = new AgentSpawner(childConfig.id, this.currentDepth + 1, this.config, this.agentFactory, this.costTracker, this.tracer);
        const child = this.agentFactory.create(childConfig, childSpawner);
        const childSessionId = `${parent.config.id}_child_${Date.now()}`;
        this.children.set(childConfig.id, child);
        this._childCount++;
        this.spawnTree[this.parentAgentId] = [
            ...(this.spawnTree[this.parentAgentId] ?? []), childConfig.id
        ];
        this.tracer.recordSpawn(this.parentAgentId, childConfig.id);
        try {
            const result = await child.run(request.task, childSessionId);
            if (request.onComplete)
                request.onComplete(result);
            return result;
        }
        finally {
            if (request.autoTerminate !== false)
                this.terminate(childConfig.id);
        }
    }
    async spawnMany(parent, requests) {
        const batches = chunk(requests, this.config.maxConcurrentChildren);
        const results = [];
        for (const batch of batches) {
            results.push(...await Promise.all(batch.map(r => this.spawn(parent, r))));
        }
        return results;
    }
    async fanOut(parent, task, subtasks, tools) {
        const results = await this.spawnMany(parent, subtasks.map((t, i) => ({ name: `worker_${i}`, task: t, tools, autoTerminate: true })));
        return results.map(r => r.text).join('\n\n---\n\n');
    }
    buildChildConfig(parentConfig, request) {
        return {
            ...parentConfig,
            id: `agent_${Math.random().toString(36).substr(2, 9)}`,
            name: request.name,
            tools: request.tools ?? parentConfig.tools
        };
    }
    validateDepth() {
        if (this.currentDepth >= this.config.maxDepth) {
            throw new types_1.OpenSkeleaError('MAX_SPAWN_DEPTH', `Cannot spawn beyond depth ${this.config.maxDepth}`);
        }
    }
    validateConcurrency() {
        if (this.children.size >= this.config.maxConcurrentChildren) {
            throw new types_1.OpenSkeleaError('MAX_CONCURRENT_CHILDREN', `Cannot run more than ${this.config.maxConcurrentChildren} concurrent child agents`);
        }
    }
    validateCostBudget() {
        // Check remaining spawn tree budget
    }
    terminate(childId) {
        this.children.delete(childId);
    }
}
exports.AgentSpawner = AgentSpawner;
