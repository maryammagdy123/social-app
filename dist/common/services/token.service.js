"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
class TokenService {
    generateAccessToken(payload, secretKey = config_1.ACCESS_TOKEN_SECRET_KEY, options) {
        return jsonwebtoken_1.default.sign(payload, secretKey, options);
    }
    generateRefreshToken(payload, secretKey = config_1.REFRESH_TOKEN_SECRET_KEY, options) {
        return jsonwebtoken_1.default.sign(payload, secretKey, options);
    }
    verifyToken(token, secretKey) {
        try {
            return jsonwebtoken_1.default.verify(token, secretKey);
        }
        catch {
            return null;
        }
    }
}
exports.TokenService = TokenService;
