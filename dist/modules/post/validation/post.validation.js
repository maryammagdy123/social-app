"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactToPostSchema = exports.createPostSchema = void 0;
const reaction_enum_1 = require("./../../../common/enums/reaction.enum");
const zod_1 = __importDefault(require("zod"));
const exceptions_1 = require("../../../common/exceptions");
exports.createPostSchema = {
    body: zod_1.default
        .strictObject({
        content: zod_1.default.string().optional(),
        attachments: zod_1.default.array(zod_1.default.string()).optional(),
    })
        .refine((data) => {
        const { attachments, content } = data;
        if (!content && (!attachments || attachments.length === 0)) {
            throw new exceptions_1.ValidationError("Post can not be empty!");
        }
        return true;
    }),
};
exports.reactToPostSchema = {
    body: zod_1.default.strictObject({
        postId: zod_1.default.string(),
        type: zod_1.default.enum(reaction_enum_1.REACTION_ENUM)
    })
};
