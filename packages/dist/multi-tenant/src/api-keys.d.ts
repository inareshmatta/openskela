import type { Organization } from './org';
export interface ApiKey {
    id: string;
    orgId: string;
    name: string;
    scopes: string[];
    expiresAt?: Date;
    hash: string;
}
export declare class ApiKeyManager {
    private keys;
    create(orgId: string, name: string, scopes: string[], expiresAt?: Date): Promise<{
        key: string;
        id: string;
    }>;
    validate(rawKey: string, mockOrgLookup: (id: string) => Organization): Promise<ApiKey & {
        organization: Organization;
    }>;
    revoke(keyId: string): Promise<void>;
    rotate(keyId: string): Promise<{
        key: string;
        id: string;
    }>;
    private hash;
}
