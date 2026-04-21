"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const post_service_1 = require("./post.service");
const response_1 = require("../../common/response");
const post_validation_1 = require("./validation/post.validation");
const router = (0, express_1.Router)();
router.post("/", (0, middlewares_1.authenticateUser)("strict"), (0, middlewares_1.validation)(post_validation_1.createPostSchema.body), async (req, res, next) => {
    const userId = req.user._id;
    const post = await post_service_1.postService.createPost(req.body, userId);
    (0, response_1.successResponse)({
        res,
        message: "Post created successfully",
        status: 201,
        data: { post },
    });
});
router.post("/react-to-post", (0, middlewares_1.authenticateUser)("strict"), (0, middlewares_1.validation)(post_validation_1.reactToPostSchema.body), async (req, res, next) => {
    const userId = req.user._id;
    await post_service_1.postService.reactToPost(req.body, userId);
    res.sendStatus(204);
});
exports.default = router;
