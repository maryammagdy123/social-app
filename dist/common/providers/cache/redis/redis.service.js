"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis_1 = require("redis");
const exceptions_1 = require("../../../exceptions");
class RedisService {
    redisClient;
    constructor(redisConfig) {
        this.redisClient = (0, redis_1.createClient)(redisConfig);
        this.handleEvent();
    }
    handleEvent() {
        this.redisClient.on("error", (error) => {
            console.error("Redis Error:", error);
        });
        this.redisClient.on("ready", () => {
            console.log("Connected to redis successfully!");
        });
    }
    async connect() {
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
        }
    }
    async get(key) {
        const cached = await this.redisClient.get(key);
        if (!cached)
            return null;
        try {
            return JSON.parse(cached);
        }
        catch {
            return cached;
        }
    }
    async set(key, value, ttl) {
        const formattedValue = typeof value === "object" ? JSON.stringify(value) : value;
        await this.redisClient.set(key, formattedValue, { EX: ttl });
    }
    async delete(key) {
        return await this.redisClient.del(key);
    }
    async clear() {
        return await this.redisClient.flushDb();
    }
    allSessionsSetKey = (userId) => {
        return `user_sessions:${userId}`;
    };
    sessionKey = (userId, sessionId) => {
        return `refresh:${userId}:${sessionId}`;
    };
    otpKey = (email, purpose) => {
        return `OTP::${purpose}::${email}`;
    };
    key = (email) => {
        return `USER::${email}`;
    };
    checkKeyExistence = async (key) => {
        return await this.redisClient.exists(key);
    };
    ensureTTL = async (key, minTTL) => {
        const ttl = await this.redisClient.ttl(key);
        if (ttl > minTTL) {
            throw new exceptions_1.BadRequestError(`Please wait ${ttl} seconds before trying again!`);
        }
        return ttl;
    };
    saveSessions = async (userId, sessionId, refreshToken) => {
        await this.redisClient.sAdd(this.allSessionsSetKey(userId), sessionId);
        await this.set(this.sessionKey(userId, sessionId), refreshToken, 7 * 24 * 60 * 60);
    };
    sMembers = async (key) => {
        return this.redisClient.sMembers(key);
    };
    sRem = async (key, member) => {
        return this.redisClient.sRem(key, member);
    };
    sIsMember = async (key, member) => {
        return await this.redisClient.sIsMember(key, member);
    };
    keys = async (userId) => {
        return await this.redisClient.keys(`refresh:${userId}:*`);
    };
}
exports.RedisService = RedisService;
