"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.RedisService = void 0;
const redis_1 = require("redis");
const config_1 = require("../../config");
const exceptions_1 = require("../exceptions");
class RedisService {
    redisClient;
    constructor() {
        this.redisClient = (0, redis_1.createClient)({ url: config_1.REDIS_URL });
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
    allSessionsSetKey = (userId) => {
        return `user_sessions:${userId}`;
    };
    sessionKey = (userId, sessionId) => {
        return ` refresh:${userId}:${sessionId}`;
    };
    otpKey = (email, purpose) => {
        return `OTP::${purpose}::${email}`;
    };
    key = (email) => {
        return `USER::${email}`;
    };
    getFromCache = async (key) => {
        const cached = await this.redisClient.get(key);
        if (!cached)
            return null;
        try {
            return JSON.parse(cached);
        }
        catch {
            return cached;
        }
    };
    saveInCache = async (key, value, ex = 5 * 60) => {
        const formattedValue = typeof value === "object" ? JSON.stringify(value) : value;
        return this.redisClient.set(key, formattedValue, { EX: ex });
    };
    deleteFromCache = async (key) => {
        return this.redisClient.del(key);
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
        await this.saveInCache(this.sessionKey(userId, sessionId), refreshToken, 7 * 24 * 60 * 60);
    };
    sMembers = async (key) => {
        return this.redisClient.sMembers(key);
    };
    sRem = async (key, member) => {
        return this.redisClient.sRem(key, member);
    };
    sIsMember = async (key, member) => {
        return this.redisClient.sIsMember(key, member);
    };
}
exports.RedisService = RedisService;
exports.redisService = new RedisService();
