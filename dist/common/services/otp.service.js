"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const exceptions_1 = require("../exceptions");
const utils_1 = require("../utils");
const redis_service_1 = require("./redis.service");
class OTP {
    email;
    constructor(email) {
        this.email = email;
    }
    generateOTP = async (keyPurpose) => {
        const otp = (0, utils_1.generateOTP)();
        await redis_service_1.redisService.saveInCache(redis_service_1.redisService.otpKey(this.email, keyPurpose), await (0, utils_1.hash)(otp), 300);
        return otp;
    };
    verifyOTP = async (otp, kyePurpose) => {
        const key = redis_service_1.redisService.otpKey(this.email, kyePurpose);
        if (!key) {
            throw new exceptions_1.NotFoundError("No such key found!");
        }
        const cachedOTP = await redis_service_1.redisService.getFromCache(key);
        if (!cachedOTP) {
            throw new exceptions_1.NotFoundError("Cannot find OTP or expired!!");
        }
        const isCompare = await (0, utils_1.compare)(otp, cachedOTP);
        if (!isCompare) {
            throw new exceptions_1.BadRequestError("Invalid OTP");
        }
        await redis_service_1.redisService.deleteFromCache(key);
        await redis_service_1.redisService.deleteFromCache(redis_service_1.redisService.key(this.email));
        return true;
    };
    resendOtp = async (keyPurpose, type) => {
        const key = redis_service_1.redisService.otpKey(this.email, keyPurpose);
        await redis_service_1.redisService.ensureTTL(key, 180);
        const otp = await this.generateOTP(keyPurpose);
        await (0, utils_1.sendOTPEmail)(this.email, otp, type);
    };
}
exports.OTP = OTP;
