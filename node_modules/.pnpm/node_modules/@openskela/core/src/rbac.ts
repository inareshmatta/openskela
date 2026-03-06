export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';

export const PERMISSION_SCOPES = {
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
} as const;

export type PermissionScope = keyof typeof PERMISSION_SCOPES;

export const ROLE_PERMISSIONS: Record<OrgRole, PermissionScope[]> = {
    owner: ['*'],
    admin: [
        'agents:read', 'agents:create', 'agents:run', 'agents:delete',
        'tools:*', 'memory:read', 'memory:write', 'skills:install',
        'billing:view', 'billing:manage'
    ] as PermissionScope[],
    member: [
        'agents:read', 'agents:run', 'memory:read', 'memory:write'
    ] as PermissionScope[], // plus subset of tools later
    viewer: [
        'agents:read', 'billing:view'
    ] as PermissionScope[],
};
