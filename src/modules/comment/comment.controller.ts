import { NextFunction, Request, Response, Router } from "express";
import { authenticateUser, validation } from "../../middlewares";
import { commentService } from "./comment.service";
import { successResponse } from "../../common/response";
import { addCommentSchema, reactToCommentSchema } from "./validation/comment.validation";

const router = Router({ mergeParams: true });
//post/postId/comment =>> commenting direct on post
//post/postId/comment/commentId =>> commenting (replying) on a comment

router.post(
  "/react-to-comment",
  authenticateUser("strict"),
  validation(reactToCommentSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    await commentService.addReaction(req.body,req.user._id)
    res.sendStatus(204);
  },
);
router.post(
  "{/:parentId}",
  authenticateUser("strict"),
  validation(addCommentSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const comment = await commentService.addComment(
      req.body,
      req.params,
      userId,
    );
    successResponse({
      res,
      message: "Comment added successfully",
      status: 201,
      data: {
        comment,
      },
    });
  },
);
export default router;
