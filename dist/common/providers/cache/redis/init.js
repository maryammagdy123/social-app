"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = void 0;
const config_1 = require("../../../../config");
const redis_service_1 = require("./redis.service");
exports.redisService = new redis_service_1.RedisService({
    url: config_1.REDIS_URL,
});
