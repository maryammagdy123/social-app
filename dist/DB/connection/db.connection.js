"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../config");
const authenticateDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.DB_URI);
        console.log("Database connected successfully!");
    }
    catch (error) {
        console.log("failed to connect to database!", error);
    }
};
exports.authenticateDB = authenticateDB;
