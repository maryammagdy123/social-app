"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../../config");
const exceptions_1 = require("../exceptions");
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY = Buffer.from(config_1.ENCRYPTION_SECRET_KEY);
function encrypt(plaintext) {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);
    let encrypted = cipher.update(plaintext);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}
function decrypt(data) {
    const [iv, encryptedText] = data.split(":") || [];
    if (!iv || !encryptedText) {
        throw new exceptions_1.BadRequestError("Invalid encryption parts!");
    }
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, Buffer.from(KEY), Buffer.from(iv, "hex"));
    if (!encryptedText) {
        throw new Error("Encrypted text is missing");
    }
    let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
