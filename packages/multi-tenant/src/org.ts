import type { OrgRole } from '@openskela/core';
import { OpenSkeleaError } from '@openskela/core';

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

export class OrgManager {
    // Mock Postgres
    private orgs = new Map<string, Organization>();
    private members = new Map<string, OrgMember>();

    async create(name: string, ownerId: string): Promise<Organization> {
        const id = `org_${Math.random().toString(36).substr(2, 9)}`;
        const org = { id, name, ownerId, createdAt: new Date() };
        this.orgs.set(id, org);
        await this.addMember(id, ownerId, 'owner');
        return org;
    }

    async addMember(orgId: string, userId: string, role: OrgRole): Promise<OrgMember> {
        if (!this.orgs.has(orgId)) throw new OpenSkeleaError('ORG_NOT_FOUND', 'Org missing');

        // In Prisma: ROLE_PERMISSIONS[role] is appended or queried structurally
        const member = { orgId, userId, role, permissions: role === 'owner' ? ['*'] : [] };
        const key = `${orgId}_${userId}`;
        this.members.set(key, member);
        return member;
    }

    async updateRole(orgId: string, userId: string, role: OrgRole): Promise<void> {
        const key = `${orgId}_${userId}`;
        const member = this.members.get(key);
        if (!member) throw new OpenSkeleaError('MEMBER_NOT_FOUND', 'User not in org');

        member.role = role;
        this.members.set(key, member);
    }

    async removeMember(orgId: string, userId: string): Promise<void> {
        const key = `${orgId}_${userId}`;
        this.members.delete(key);
    }
}
