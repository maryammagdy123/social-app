import { createClient, RedisClientType } from "redis";
import { ICacheProvider } from "../cache.interface";
import { Types } from "mongoose";
import { BadRequestError } from "../../../exceptions";
interface RedisConfig {
  url: string;
}
export class RedisService implements ICacheProvider {
  private readonly redisClient: RedisClientType;
  constructor(redisConfig: RedisConfig) {
    this.redisClient = createClient(redisConfig);
    this.handleEvent();
  }

  private handleEvent() {
    this.redisClient.on("error", (error) => {
      console.error("Redis Error:", error);
    });

    this.redisClient.on("ready", () => {
      console.log("Connected to redis successfully!");
    });
  }
  public async connect() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
  }
  async get<T>(key: string): Promise<T | string | null> {
    const cached = await this.redisClient.get(key);
    if (!cached) return null;
    try {
      return JSON.parse(cached) as T;
    } catch {
      return cached; // Return raw string (e.g., bcrypt hash)
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const formattedValue =
      typeof value === "object" ? JSON.stringify(value) : value;

    await this.redisClient.set(key, formattedValue, { EX: ttl as number });
  }
  async delete(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
  async clear(): Promise<string | null> {
    return await this.redisClient.flushDb();
  }

  //all logged in user'sessions set
  public allSessionsSetKey = (userId: Types.ObjectId) => {
    return `user_sessions:${userId}`;
  };

  //user session (per device) key
  public sessionKey = (userId: Types.ObjectId, sessionId: string) => {
    return `refresh:${userId}:${sessionId}`;
  };

  public otpKey = (email: string, purpose: string) => {
    return `OTP::${purpose}::${email}`;
  };
  public key = (email: string) => {
    return `USER::${email}`;
  };
  public checkKeyExistence = async (key: string): Promise<number> => {
    return await this.redisClient.exists(key);
  };
  public ensureTTL = async (key: string, minTTL: number): Promise<number> => {
    const ttl = await this.redisClient.ttl(key);
    if (ttl > minTTL) {
      throw new BadRequestError(
        `Please wait ${ttl} seconds before trying again!`,
      );
    }
    return ttl;
  };

  public saveSessions = async (
    userId: Types.ObjectId,
    sessionId: string,
    refreshToken: string,
  ): Promise<void> => {
    await this.redisClient.sAdd(this.allSessionsSetKey(userId), sessionId); // use it when logout from all sessions

    await this.set(
      this.sessionKey(userId, sessionId),
      refreshToken,
      7 * 24 * 60 * 60,
    );
  };

  public sMembers = async (key: string): Promise<string[]> => {
    return this.redisClient.sMembers(key);
  };

  public sRem = async (key: string, member: string) => {
    return this.redisClient.sRem(key, member);
  };
  public sIsMember = async (key: string, member: string) => {
    return await this.redisClient.sIsMember(key, member);
  };
  public keys = async (userId: Types.ObjectId) => {
    return await this.redisClient.keys(`refresh:${userId}:*`);
  };
  public  async addToSet(key: string, value: string): Promise<void> {
     await this.redisClient.sAdd(key, value);
  };
}
