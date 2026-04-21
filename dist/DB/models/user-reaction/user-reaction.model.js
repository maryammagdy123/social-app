"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionModel = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const schema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    refId: {
        type: mongoose_1.Types.ObjectId,
        refPath: "onModel",
        required: true,
    },
    onModel: {
        type: String,
        enum: common_1.ON_MODEL,
        required: true,
    },
    type: {
        type: Number,
        enum: common_1.REACTION_ENUM,
    },
}, { timestamps: true });
exports.ReactionModel = (0, mongoose_1.model)("Reaction", schema);
