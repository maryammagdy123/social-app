import { Types } from "mongoose";
import { IAddCommentDTO } from "./comment.dto";
import { PostRepository } from "../../DB/models/post";
import { BadRequestError, NotFoundError } from "../../common/exceptions";
import { CommentRepository } from "../../DB/models/comment/comment.repository";


class CommentService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public addComment = async (
    addCommentDTO: IAddCommentDTO,
    params: any,
    userId: Types.ObjectId,
  ) => {
    //check post existence
    const existingPost = await this.postRepository.findById(params.postId);
    console.log(params);
    if (!existingPost) {
      throw new NotFoundError(
        "This post is not available , post has been deleted",
      );
    }
    // check if is allowed to comment on this post
    if (existingPost) {
      if (existingPost.commentDisabled) {
        throw new BadRequestError(
          "The post creator turned of comments for this post",
        );
      }
    }
    //if replying to a comment , check for a comment existence
    let existingComment;
    if (params.parentId) {
      existingComment = await this.commentRepository.findById(params.parentId);
      if (!existingComment) {
        throw new BadRequestError(
          "Can not reply to this comment , its may be deleted ",
        );
      }
    }
    // if post existing and allowing comments
    const comment = await this.commentRepository.create({
      userId,
      ...params,
      ...addCommentDTO,
    });
    await this.postRepository.updateOne(
      { _id: params.postId },
      { $inc: { commentsCount: 1 } },
    );
    return comment;
  };
}

export const commentService = new CommentService(
  new PostRepository(),
  new CommentRepository(),
);
