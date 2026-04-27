import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../common/exceptions";

import { AddCommentDTO, ReactToCommentDTO } from "./comment.dto";
import {
  CommentRepository,
  PostRepository,
  UserReactionRepository,
} from "../../DB";
import { IPost, ON_MODEL } from "../../common";

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
      return await this.userReactionRepository.findByIdAndDelete(
        existingReaction._id,
      );
    }
    //if user does  not reacted to this comment before , make a new react
    return await this.userReactionRepository.create({
      userId,
      ...reactToCommentDTO,
      onModel: ON_MODEL.Comment,
      refId: existingComment._id,
    });
  };
  public getAllComments = async (params: any) => {
    const post = await this.postRepository.findById(params.postId);
    if (!post) {
      throw new NotFoundError("Post is not available can not get comments");
    }
    if (post) {
      if (post.commentsCount == 0) {
        throw new BadRequestError("This post has no comments");
      }
      if (params.postId && params.parentId !== "") {
        console.log(params);
        const existingComment = await this.commentRepository.findById(
          params.parentId,
        );

        if (!existingComment) {
          throw new NotFoundError("Comment not available or might be deleted");
        }

        const comments = await this.commentRepository.find({
          postId: params.postId,
          parentId: params.parentId,
        });
        return comments;
      }
      if (params.postId) {
        const comments = await this.commentRepository.find({
          postId: params.postId,
        });
        console.log(comments);
        console.log(params);
        return comments;
      }
    }
    return;
  };

  public deleteComment = async (id:Types.ObjectId, userId: Types.ObjectId) => {
    console.log({id,userId})
    const comment = await this.commentRepository.findOne(
      { _id: id },
      {},
      { populate: [{ path: "postId" }] },
    );
    if (!comment) {
      throw new NotFoundError("Comment not found!");
    }

    const postAuthor = (comment.postId as IPost[])[0]?.userId.toString();
    const commentAuthor = comment.userId.toString();
    if (![postAuthor, commentAuthor].includes(userId.toString())) {
      throw new UnauthorizedError(
        "You are not authorized to delete this comment",
      );
    }
    //delete comment it self and related replies
    return await this.commentRepository.deleteOne({ _id: id });
  };
}

export const commentService = new CommentService(
  new PostRepository(),
  new CommentRepository(),
  new UserReactionRepository(),
);
