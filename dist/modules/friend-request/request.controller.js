"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const request_service_1 = __importDefault(require("./request.service"));
const mongoose_1 = require("mongoose");
const response_1 = require("../../common/response");
const router = (0, express_1.Router)();
router.post("/:receiverId", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const data = await request_service_1.default.sendRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.receiverId));
    (0, response_1.successResponse)({
        res,
        message: "Request sent successfully!",
        status: 201,
        data,
    });
});
exports.default = router;
