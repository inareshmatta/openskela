"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.PERMISSION_SCOPES = void 0;
exports.PERMISSION_SCOPES = {
    'agents:read': 'View agents and their configs',
    'agents:create': 'Create new agents',
    'agents:run': 'Run agents',
    'agents:delete': 'Delete agents',
    'tools:*': 'Use all tools',
    'tools:trading': 'Use trading tools',
    'tools:payment': 'Use payment tools',
    'tools:browser': 'Use browser automation',
    'tools:code': 'Execute code',
    'memory:read': 'Read user memory',
    'memory:write': 'Write to user memory',
    'skills:install': 'Install marketplace skills',
    'billing:view': 'View cost reports',
    'billing:manage': 'Manage budgets',
    'org:manage': 'Manage org settings and members',
    '*': 'All permissions (owner only)',
};
exports.ROLE_PERMISSIONS = {
    owner: ['*'],
    admin: [
        'agents:read', 'agents:create', 'agents:run', 'agents:delete',
        'tools:*', 'memory:read', 'memory:write', 'skills:install',
        'billing:view', 'billing:manage'
    ],
    member: [
        'agents:read', 'agents:run', 'memory:read', 'memory:write'
    ], // plus subset of tools later
    viewer: [
        'agents:read', 'billing:view'
    ],
};
