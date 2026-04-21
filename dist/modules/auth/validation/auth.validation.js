"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpSchema = exports.confirmEmailSchema = exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../../common");
exports.loginSchema = {
    body: zod_1.default.strictObject({
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(8, { error: "invalid password!" }),
    }),
};
exports.signupSchema = {
    body: exports.loginSchema.body.safeExtend({
        username: zod_1.default
            .string()
            .min(2, { error: "Username must be at least 2 characters !" })
            .max(20, { error: "Maximum length is 20 character!" }),
        role: zod_1.default.enum(common_1.RoleEnum).default(common_1.RoleEnum.user),
        gender: zod_1.default.enum(common_1.GenderEnum).default(common_1.GenderEnum.male),
        provider: zod_1.default.enum(common_1.ProviderEnum).default(common_1.ProviderEnum.system),
    }),
};
exports.confirmEmailSchema = {
    body: zod_1.default.strictObject({
        email: zod_1.default.string().email(),
        otp: zod_1.default.string().length(6, { error: "Invalid OTP length" }),
    }),
};
exports.resendOtpSchema = {
    body: zod_1.default.strictObject({
        email: zod_1.default.string().email(),
        type: zod_1.default.enum(common_1.EmailEnum),
    }),
};
