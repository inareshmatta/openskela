<div align="center">
  <img src="./openskela-banner.png" alt="OpenSkela - Opensource Agent Framework" width="800" />
</div>

# OpenSkela 

> ⚠️ **WORK IN PROGRESS (WIP)**
> 
> This project is currently under active, heavy development. Features, APIs, and the core architecture are incomplete and subject to change at any time. Use at your own risk.

**OpenSkela** is an advanced open-source agent operating system framework designed for scalable, multi-tenant agent orchestration, featuring sandboxed skills, dynamic MCP server connections, robust memory layers, and dual-model trading consensus.

## Current Project Phases
- Phase 1: Foundation (Agent Core) ✅
- Phase 2: Control Panel & Settings ✅
- Phase 3: Multi-Tenant & RBAC ✅
- Phase 4: Tools & Integrations ✅
- Phase 5: Context Engine ✅
- Phase 6: Memory Layer (Vector, Graph, ShortTerm) ✅
- Phase 7: Trading Agent System ✅
- Phase 8: Dynamic Agent Spawning ✅
- Phase 9: Skills System & Marketplace ✅
- Phase 10: MCP Server Layer ✅
- Phase 11: App Builder Agent ✅
- Phase 12-16: Observability, Hardening, Wizard, Evaluation, Deployments 🏗️

## Core Highlights (from Master v6)

- **LLM Agnostic**: Pluggable architectures supporting Claude, OpenAI, Gemini, Grok, and Ollama.
- **Dynamic Orchestration**: Tree-based agent spanning with depth, cost, and concurrency controls.
- **Multimodal**: Dual-model trading consensus, voice transcription (STT), and platform-aware TTS delivery.
- **Strict Security**: Wasmer/isolated-vm sandboxes, taint tracking, Merkle audit chains, and SSRF filtering.
- **Cognitive Architecture**: Semantic Memory Management Unit (SMMU) providing L1/L2 cognitive memory and entropy guards.
- **Memory Layers**: Vector (Qdrant), Graph (FalkorDB), and standard session storage.
- **Tools Integrations**: 60+ mocked and structured real tools across web, shopping, and data platforms.
- **Control Panel**: Highly granular RBAC multi-tenant system covering user and org spending, limits, and behavior.
- **Self-Forging Agents (ToolForge)**: The ability for an agent to dynamically craft its own tools in a sandbox based on errors.

> **Status Quo Check**: Currently, the framework is heavily scaffolded. Most `packages/` represent robust class-level skeletons with typed interfaces and mock responses that define the boundaries. Integrations to specific backends (like Postgres, Redis, VectorDBs) use mock classes pending exact credential integrations.

## Getting Started

Ensure you have Node.js and **pnpm** installed. OpenSkela uses Turborepo for workspace management.

```bash
# 1. Install dependencies
pnpm install

# 2. Build the workspace
npx turbo run build
```

## Packages Structure

- `@openskela/core` - Base agent schemas and orchestrator logic
- `@openskela/adapters` - LLM providers (Claude, OpenAI, Gemini)
- `@openskela/context` - Context assembler and Token Budgeting
- `@openskela/memory` - Short-term, Long-term, Vector, Graph memory abstractions
- `@openskela/tools` - Tool registry and Feature Authorizer
- `@openskela/trading` - Multi-LLM trading consensus algorithms
- `@openskela/mcp` - Model Context Protocol generic adapter support
- `@openskela/skills` - Multi-Layer Sandboxed Skills architecture
- `@openskela/security` - Multi-layer source code security scanning
- `@openskela/marketplace` - Skill moderation and distribution
- `@openskela/app-builder` - Autonomous code builder orchestrator
- `@openskela/observability` - Strict JSON centralized telemetry
- `@openskela/api` - Main Fastify / REST endpoint hooks
- `@openskela/control-panel` - Settings and command interceptors
- `@openskela/multi-tenant` - ORG, RBAC, and secure hashed API key managers

---
*Note: Please save the provided logo image as `openskela-banner.png` in the root repository folder to display it properly in this README.*
