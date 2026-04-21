"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const middlewares_1 = require("./middlewares");
const DB_1 = require("./DB");
const services_1 = require("./common/services");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = require("./modules/user");
const bootstrap = async () => {
    console.log("Bootstrapping the application...");
    const app = (0, express_1.default)();
    await (0, DB_1.authenticateDB)();
    await services_1.redisService.connect();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get("/", (req, res, next) => {
        res.status(200).json("Hello, World!");
    });
    app.use("/api/auth", modules_1.authRouter);
    app.use("/api/user", user_1.userRouter);
    app.use("/api/post", modules_1.postRouter);
    app.get("/*dummy", (req, res, next) => {
        res.status(404).json("Not Found");
    });
    app.use(middlewares_1.globalErrorHandler);
    app.listen(3000, () => {
        console.log("Application is listening on port 3000");
    });
};
exports.default = bootstrap;
