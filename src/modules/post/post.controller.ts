import { NextFunction, Request, type Response, Router } from "express";
import { authenticateUser, validation } from "../../middlewares";
import { postService } from "./post.service";
import { default as commentRouter } from "../comment/comment.controller";
import { successResponse } from "../../common/response";
import {
  createPostSchema,
  reactToPostSchema,
} from "./validation/post.validation";

const router = Router();
router.use("/:postId/comment", commentRouter);
router.post(
  "/",
  authenticateUser("strict"),
  validation(createPostSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const post = await postService.createPost(req.body, userId);
    successResponse({
      res,
      message: "Post created successfully",
      status: 201,
      data: { post },
    });
  },
);
router.post(
  "/react-to-post",
  authenticateUser("strict"),
  validation(reactToPostSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    await postService.reactToPost(req.body, userId);
    res.sendStatus(204);
  },
);
export default router;
