"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_service_js_1 = require("../../config/config.service.js");
const sendOTPEmail = async (email, otp, subject, text = `Your OTP code is: ${otp}`) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_service_js_1.SMTP_USER,
            pass: config_service_js_1.SMTP_PASSWORD_KEY,
        },
    });
    const mailOptions = {
        from: '"Social Media App" <no-reply@social.com>',
        to: email,
        subject,
        text,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendOTPEmail = sendOTPEmail;
