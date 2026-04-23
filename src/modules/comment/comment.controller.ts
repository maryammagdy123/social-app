import { NextFunction, Request, Response, Router } from "express";
import { authenticateUser } from "../../middlewares";
import { commentService } from "./comment.service";
import { successResponse } from "../../common/response";

const router = Router({ mergeParams: true });
//post/postId/comment =>> commenting direct on post
//post/postId/comment/commentId =>> commenting (replying) on a comment
router.post(
  "{/:parentId}",
  authenticateUser("strict"),
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
