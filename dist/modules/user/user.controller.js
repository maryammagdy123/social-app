"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = require("./user.service");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.default)();
router.post("/logout", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
        return res.sendStatus(204);
    await user_service_1.userService.sessionLogout(refreshToken);
    res.clearCookie("refreshToken", {
        path: "/",
    });
    return res.sendStatus(204);
});
router.post("/logout/all", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
        return res.sendStatus(204);
    await user_service_1.userService.logoutAllSessions(refreshToken);
    res.clearCookie("refreshToken", {
        path: "/",
    });
    return res.sendStatus(204);
});
exports.default = router;
