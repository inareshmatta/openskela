"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyManager = void 0;
const crypto_1 = require("crypto");
const core_1 = require("@openskela/core");
class ApiKeyManager {
    // Mock DB Storage
    keys = new Map();
    async create(orgId, name, scopes, expiresAt) {
        const rawSecret = (0, crypto_1.randomBytes)(32).toString('hex');
        const keyString = `osk_live_${rawSecret}`;
        const id = `key_${Math.random().toString(36).substr(2, 9)}`;
        const hash = this.hash(keyString);
        const apiKey = { id, orgId, name, scopes, expiresAt, hash };
        this.keys.set(id, apiKey);
        // key string is NEVER returnable again after this point
        return { key: keyString, id };
    }
    async validate(rawKey, mockOrgLookup) {
        const hash = this.hash(rawKey);
        // await db.apiKey.findUnique({ where: { hash } })
        const keyEntry = Array.from(this.keys.values()).find(k => k.hash === hash);
        if (!keyEntry)
            throw new core_1.OpenSkeleaError('INVALID_API_KEY', 'Unauthorized');
        if (keyEntry.expiresAt && keyEntry.expiresAt < new Date()) {
            throw new core_1.OpenSkeleaError('API_KEY_EXPIRED', 'Key has expired');
        }
        const org = mockOrgLookup(keyEntry.orgId);
        return { ...keyEntry, organization: org };
    }
    async revoke(keyId) {
        this.keys.delete(keyId);
    }
    async rotate(keyId) {
        const existing = this.keys.get(keyId);
        if (!existing)
            throw new core_1.OpenSkeleaError('KEY_NOT_FOUND', 'Key does not exist');
        await this.revoke(keyId);
        return this.create(existing.orgId, existing.name, existing.scopes, existing.expiresAt);
    }
    hash(key) {
        return (0, crypto_1.createHash)('sha256').update(key).digest('hex');
    }
}
exports.ApiKeyManager = ApiKeyManager;
