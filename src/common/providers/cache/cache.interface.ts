import { IAuthRedisProvider } from "./redis/redis.interface";

export interface ICacheProvider extends IAuthRedisProvider {
  get<T>(key: string): Promise<T | string | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string | string[]): Promise<number>;
  clear(): Promise<string | null>;
}
