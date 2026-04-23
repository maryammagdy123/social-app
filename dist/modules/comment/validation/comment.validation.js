"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
exports.addCommentSchema = {
    body: zod_1.default
        .strictObject({
        content: zod_1.default.string().trim().min(1).optional(),
        attachment: zod_1.default.string().url().optional(),
        mentions: zod_1.default
            .array(zod_1.default
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val))
            .transform((val) => new mongoose_1.Types.ObjectId(val)))
            .optional(),
    })
        .refine((data) => data.content || data.attachment, {
        message: "Comment cannot be empty",
    }),
};
