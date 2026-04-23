"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
    },
    mentions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    attachment: String,
    content: String,
}, { timestamps: true });
exports.CommentModel = (0, mongoose_1.model)("Comment", commentSchema);
