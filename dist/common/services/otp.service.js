"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const exceptions_1 = require("../exceptions");
const utils_1 = require("../utils");
class OTP {
    email;
    emailProvider;
    cacheProvider;
    constructor(email, emailProvider, cacheProvider) {
        this.email = email;
        this.emailProvider = emailProvider;
        this.cacheProvider = cacheProvider;
    }
    generateOTP = async (keyPurpose) => {
        const otp = (0, utils_1.generateOTP)();
        await this.cacheProvider.set(this.cacheProvider.otpKey(this.email, keyPurpose), await (0, utils_1.hash)(otp), 300);
        return otp;
    };
    verifyOTP = async (otp, kyePurpose) => {
        const key = this.cacheProvider.otpKey(this.email, kyePurpose);
        if (!key) {
            throw new exceptions_1.NotFoundError("No such key found!");
        }
        const cachedOTP = await this.cacheProvider.get(key);
        if (!cachedOTP) {
            throw new exceptions_1.NotFoundError("Cannot find OTP or expired!!");
        }
        const isCompare = await (0, utils_1.compare)(otp, cachedOTP);
        if (!isCompare) {
            throw new exceptions_1.BadRequestError("Invalid OTP");
        }
        await this.cacheProvider.delete(key);
        await this.cacheProvider.delete(this.cacheProvider.key(this.email));
        return true;
    };
    resendOtp = async (keyPurpose, type) => {
        const key = this.cacheProvider.otpKey(this.email, keyPurpose);
        await this.cacheProvider.ensureTTL(key, 180);
        const otp = await this.generateOTP(keyPurpose);
        await this.emailProvider.send(this.email, type, `Your OTP code is: ${otp}`);
    };
}
exports.OTP = OTP;
