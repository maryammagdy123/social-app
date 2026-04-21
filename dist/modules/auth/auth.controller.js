"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const middlewares_1 = require("../../middlewares");
const auth_validation_1 = require("./validation/auth.validation");
const response_1 = require("../../common/response");
const authentication_middleware_1 = require("../../middlewares/authentication.middleware");
const exceptions_1 = require("../../common/exceptions");
const router = (0, express_1.Router)();
router.post("/register", (0, middlewares_1.validation)(auth_validation_1.signupSchema.body), async (req, res, next) => {
    const data = await auth_service_1.default.signup(req.body);
    (0, response_1.successResponse)({
        res,
        message: data.message,
        status: data.status,
        data: data.data,
    });
});
router.post("/verify-account", (0, middlewares_1.validation)(auth_validation_1.confirmEmailSchema.body), async (req, res, next) => {
    const data = await auth_service_1.default.verifyAccount(req.body);
    (0, response_1.successResponse)({
        res,
        message: data.message,
        status: data.status,
        data: data.data,
    });
});
router.post("/resend-otp", (0, middlewares_1.validation)(auth_validation_1.resendOtpSchema.body), async (req, res, next) => {
    await auth_service_1.default.resendOtp(req.body);
    (0, response_1.successResponse)({
        res,
        message: "Code resent to your email successfully",
        status: 201,
    });
});
router.post("/login", (0, middlewares_1.validation)(auth_validation_1.loginSchema.body), async (req, res, next) => {
    const data = await auth_service_1.default.login(req.body);
    res.cookie("refreshToken", data.data?.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: false,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
    (0, response_1.successResponse)({
        res,
        message: data.message,
        status: data.status,
        data: data,
    });
});
router.post("/refresh-token", (0, authentication_middleware_1.authenticateUser)("strict"), async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new exceptions_1.BadRequestError("Session expired");
    }
    const data = await auth_service_1.default.refreshToken(refreshToken);
    res.cookie("refreshToken", data.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: false,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
    (0, response_1.successResponse)({
        res,
        message: "Access token refreshed successfully!",
        data,
    });
});
exports.default = router;
