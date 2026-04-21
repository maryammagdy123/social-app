import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../../config";
import { BadRequestError } from "../exceptions";
import { Types } from "mongoose";

export class RedisService {
  private readonly redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({ url: REDIS_URL as string });
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
  //all logged in user'sessions set
  public allSessionsSetKey = (userId: Types.ObjectId) => {
    return `user_sessions:${userId}`;
  };
  //user session (per device) key
  public sessionKey = (userId: Types.ObjectId, sessionId: string) => {
    return ` refresh:${userId}:${sessionId}`;
  };
  // //for blacklisted access tokens key
  // public blacklistedKey = (userId: Types.ObjectId, token: string) => {
  //   return `BLACKLIST:${userId}:${token}`;
  // };

  public otpKey = (email: string, purpose: string) => {
    return `OTP::${purpose}::${email}`;
  };
  public key = (email: string) => {
    return `USER::${email}`;
  };

  public getFromCache = async (key: string) => {
    const cached = await this.redisClient.get(key);
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return cached; // Return raw string (e.g., bcrypt hash)
    }
  };

  public saveInCache = async (
    key: string,
    value: any,
    ex = 5 * 60,
  ): Promise<string | null> => {
    const formattedValue =
      typeof value === "object" ? JSON.stringify(value) : value;

    return this.redisClient.set(key, formattedValue, { EX: ex });
  };

  public deleteFromCache = async (key: string): Promise<number> => {
    return this.redisClient.del(key);
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

    await this.saveInCache(
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
    return this.redisClient.sIsMember(key, member);
  };
}
export const redisService = new RedisService();
