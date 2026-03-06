import { createHash, randomBytes } from 'crypto';
import { OpenSkeleaError } from '@openskela/core';
import type { Organization } from './org';

export interface ApiKey {
    id: string;
    orgId: string;
    name: string;
    scopes: string[];
    expiresAt?: Date;
    hash: string; // The SHA256
}

export class ApiKeyManager {
    // Mock DB Storage
    private keys = new Map<string, ApiKey>();

    async create(orgId: string, name: string, scopes: string[], expiresAt?: Date): Promise<{ key: string; id: string }> {
        const rawSecret = randomBytes(32).toString('hex');
        const keyString = `osk_live_${rawSecret}`;
        const id = `key_${Math.random().toString(36).substr(2, 9)}`;
        const hash = this.hash(keyString);

        const apiKey: ApiKey = { id, orgId, name, scopes, expiresAt, hash };
        this.keys.set(id, apiKey);

        // key string is NEVER returnable again after this point
        return { key: keyString, id };
    }

    async validate(rawKey: string, mockOrgLookup: (id: string) => Organization): Promise<ApiKey & { organization: Organization }> {
        const hash = this.hash(rawKey);
        // await db.apiKey.findUnique({ where: { hash } })

        const keyEntry = Array.from(this.keys.values()).find(k => k.hash === hash);
        if (!keyEntry) throw new OpenSkeleaError('INVALID_API_KEY', 'Unauthorized');

        if (keyEntry.expiresAt && keyEntry.expiresAt < new Date()) {
            throw new OpenSkeleaError('API_KEY_EXPIRED', 'Key has expired');
        }

        const org = mockOrgLookup(keyEntry.orgId);
        return { ...keyEntry, organization: org };
    }

    async revoke(keyId: string): Promise<void> {
        this.keys.delete(keyId);
    }

    async rotate(keyId: string): Promise<{ key: string; id: string }> {
        const existing = this.keys.get(keyId);
        if (!existing) throw new OpenSkeleaError('KEY_NOT_FOUND', 'Key does not exist');

        await this.revoke(keyId);
        return this.create(existing.orgId, existing.name, existing.scopes, existing.expiresAt);
    }

    private hash(key: string): string {
        return createHash('sha256').update(key).digest('hex');
    }
}
