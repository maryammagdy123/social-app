"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const comment_service_1 = require("./comment.service");
const response_1 = require("../../common/response");
const comment_validation_1 = require("./validation/comment.validation");
const mongoose_1 = require("mongoose");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/react-to-comment", (0, middlewares_1.authenticateUser)("strict"), (0, middlewares_1.validation)(comment_validation_1.reactToCommentSchema.body), async (req, res, next) => {
    await comment_service_1.commentService.addReaction(req.body, req.user._id);
    res.sendStatus(204);
});
router.delete("/:id", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const userId = req.user._id;
    console.log(typeof req.params.id);
    await comment_service_1.commentService.deleteComment(new mongoose_1.Types.ObjectId(req.params.id), userId);
    res.sendStatus(204);
});
router.get("{/:parentId}", (0, middlewares_1.authenticateUser)("strict"), async (req, res, next) => {
    const comments = await comment_service_1.commentService.getAllComments(req.params);
    (0, response_1.successResponse)({
        res,
        message: "All comments fetched successfully",
        status: 200,
        data: {
            comments,
        },
    });
});
router.post("{/:parentId}", (0, middlewares_1.authenticateUser)("strict"), (0, middlewares_1.validation)(comment_validation_1.addCommentSchema.body), async (req, res, next) => {
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
