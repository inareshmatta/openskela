"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgManager = void 0;
const core_1 = require("@openskela/core");
class OrgManager {
    // Mock Postgres
    orgs = new Map();
    members = new Map();
    async create(name, ownerId) {
        const id = `org_${Math.random().toString(36).substr(2, 9)}`;
        const org = { id, name, ownerId, createdAt: new Date() };
        this.orgs.set(id, org);
        await this.addMember(id, ownerId, 'owner');
        return org;
    }
    async addMember(orgId, userId, role) {
        if (!this.orgs.has(orgId))
            throw new core_1.OpenSkeleaError('ORG_NOT_FOUND', 'Org missing');
        // In Prisma: ROLE_PERMISSIONS[role] is appended or queried structurally
        const member = { orgId, userId, role, permissions: role === 'owner' ? ['*'] : [] };
        const key = `${orgId}_${userId}`;
        this.members.set(key, member);
        return member;
    }
    async updateRole(orgId, userId, role) {
        const key = `${orgId}_${userId}`;
        const member = this.members.get(key);
        if (!member)
            throw new core_1.OpenSkeleaError('MEMBER_NOT_FOUND', 'User not in org');
        member.role = role;
        this.members.set(key, member);
    }
    async removeMember(orgId, userId) {
        const key = `${orgId}_${userId}`;
        this.members.delete(key);
    }
}
exports.OrgManager = OrgManager;
