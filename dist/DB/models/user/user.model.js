"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.schema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
exports.schema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    provider: {
        type: Number,
        enum: common_1.ProviderEnum,
        default: common_1.ProviderEnum.system,
    },
    bio: String,
    coverPhotos: String,
    DOB: Date,
    gender: {
        type: Number,
        enum: common_1.GenderEnum,
    },
    password: {
        type: String,
        required: function () {
            if (this.provider === common_1.ProviderEnum.google)
                return false;
            return true;
        },
    },
    profilePicture: String,
    role: {
        type: Number,
        enum: common_1.RoleEnum,
        default: common_1.RoleEnum.user,
    },
    isConfirmed: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.UserModel = (0, mongoose_1.model)("User", exports.schema);
