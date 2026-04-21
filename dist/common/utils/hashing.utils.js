"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
exports.compare = compare;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hash(plaintext) {
    return await bcrypt_1.default.hash(plaintext, 14);
}
async function compare(plaintext, hashedValue) {
    return await bcrypt_1.default.compare(plaintext, hashedValue);
}
