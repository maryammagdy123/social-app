import { Types } from "mongoose";

import { BadRequestError, NotFoundError } from "../../common/exceptions";

import { AddCommentDTO, ReactToCommentDTO } from "./comment.dto";
import {
  CommentRepository,
  PostRepository,
  UserReactionRepository,
} from "../../DB";
import { ON_MODEL } from "../../common";

class CommentService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly userReactionRepository: UserReactionRepository,
  ) {}

  public addComment = async (
    addCommentDTO: AddCommentDTO,
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

  public addReaction = async (
    reactToCommentDTO: ReactToCommentDTO,
    userId: Types.ObjectId,
  ) => {
    //check if comment is exist
    const existingComment = await this.commentRepository.findById(
      reactToCommentDTO.commentId,
    );
    if (!existingComment) {
      throw new NotFoundError("Comment not available , cannot react!");
    }
    //check if user already reacted to comment
    const existingReaction = await this.userReactionRepository.findOne({
      userId,
      refId: reactToCommentDTO.commentId,
    });
    //check if user reacted with the same rect
    if (existingReaction) {
      if (existingReaction.type !== reactToCommentDTO.type) {
        existingReaction.type = reactToCommentDTO.type;
       return await existingReaction.save();
        // TODO increase likes count on comment , add likesCount on comment model
      }
      // if the same reaction - remove reaction
      return await this.userReactionRepository.findByIdAndDelete(existingReaction._id);
    }
    //if user does  not reacted to this comment before , make a new react
    return await this.userReactionRepository.create({
      userId,
      ...reactToCommentDTO,
      onModel: ON_MODEL.Comment,
      refId:existingComment._id
    });
  };
}

export const commentService = new CommentService(
  new PostRepository(),
  new CommentRepository(),
  new UserReactionRepository(),
);
