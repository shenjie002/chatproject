import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async sAdd(key: string, ...members: string[]) {
    return this.redisClient.sAdd(key, members);
  }

  async sInterStore(newSetKey: string, set1: string, set2: string) {
    return this.redisClient.sInterStore(newSetKey, [set1, set2]);
  }

  async sIsMember(key: string, member: string) {
    return this.redisClient.sIsMember(key, member);
  }

  async sMember(key: string) {
    return this.redisClient.sMembers(key);
  }

  async exists(key: string) {
    const result = await this.redisClient.exists(key);
    return result > 0;
  }
}
