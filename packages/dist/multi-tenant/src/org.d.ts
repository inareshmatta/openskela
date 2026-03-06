import type { OrgRole } from '@openskela/core';
export interface Organization {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
}
export interface OrgMember {
    orgId: string;
    userId: string;
    role: OrgRole;
    permissions: string[];
}
export declare class OrgManager {
    private orgs;
    private members;
    create(name: string, ownerId: string): Promise<Organization>;
    addMember(orgId: string, userId: string, role: OrgRole): Promise<OrgMember>;
    updateRole(orgId: string, userId: string, role: OrgRole): Promise<void>;
    removeMember(orgId: string, userId: string): Promise<void>;
}
