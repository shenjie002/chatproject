export declare class RedisService {
    private redisClient;
    keys(pattern: string): Promise<string[]>;
    get(key: string): Promise<string>;
    set(key: string, value: string | number, ttl?: number): Promise<void>;
    sAdd(key: string, ...members: string[]): Promise<number>;
    sInterStore(newSetKey: string, set1: string, set2: string): Promise<string[]>;
    sIsMember(key: string, member: string): Promise<boolean>;
    sMember(key: string): Promise<string[]>;
    exists(key: string): Promise<boolean>;
}
