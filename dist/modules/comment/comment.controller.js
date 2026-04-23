"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const comment_service_1 = require("./comment.service");
const response_1 = require("../../common/response");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("{/:parentId}", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const userId = req.user._id;
    const comment = await comment_service_1.commentService.addComment(req.body, req.params, userId);
    (0, response_1.successResponse)({
        res,
        message: "Comment added successfully",
        status: 201,
        data: {
            comment,
        },
    });
});
exports.default = router;
