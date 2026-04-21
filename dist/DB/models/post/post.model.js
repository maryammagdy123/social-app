"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = exports.schema = void 0;
const mongoose_1 = require("mongoose");
exports.schema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: String,
    attachments: [String],
    commentsCount: {
        type: Number,
        default: 0,
    },
    reactionsCount: {
        type: Number,
        default: 0,
    },
    sharesCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.PostModel = (0, mongoose_1.model)("Post", exports.schema);
