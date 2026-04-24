"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = void 0;
const exceptions_1 = require("../../common/exceptions");
const DB_1 = require("../../DB");
const common_1 = require("../../common");
class CommentService {
    postRepository;
    commentRepository;
    userReactionRepository;
    constructor(postRepository, commentRepository, userReactionRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userReactionRepository = userReactionRepository;
    }
    addComment = async (addCommentDTO, params, userId) => {
        const existingPost = await this.postRepository.findById(params.postId);
        console.log(params);
        if (!existingPost) {
            throw new exceptions_1.NotFoundError("This post is not available , post has been deleted");
        }
        if (existingPost) {
            if (existingPost.commentDisabled) {
                throw new exceptions_1.BadRequestError("The post creator turned of comments for this post");
            }
        }
        let existingComment;
        if (params.parentId) {
            existingComment = await this.commentRepository.findById(params.parentId);
            if (!existingComment) {
                throw new exceptions_1.BadRequestError("Can not reply to this comment , its may be deleted ");
            }
        }
        const comment = await this.commentRepository.create({
            userId,
            ...params,
            ...addCommentDTO,
        });
        await this.postRepository.updateOne({ _id: params.postId }, { $inc: { commentsCount: 1 } });
        return comment;
    };
    addReaction = async (reactToCommentDTO, userId) => {
        const existingComment = await this.commentRepository.findById(reactToCommentDTO.commentId);
        if (!existingComment) {
            throw new exceptions_1.NotFoundError("Comment not available , cannot react!");
        }
        const existingReaction = await this.userReactionRepository.findOne({
            userId,
            refId: reactToCommentDTO.commentId,
        });
        if (existingReaction) {
            if (existingReaction.type !== reactToCommentDTO.type) {
                existingReaction.type = reactToCommentDTO.type;
                return await existingReaction.save();
            }
            return await this.userReactionRepository.findByIdAndDelete(existingReaction._id);
        }
        return await this.userReactionRepository.create({
            userId,
            ...reactToCommentDTO,
            onModel: common_1.ON_MODEL.Comment,
            refId: existingComment._id,
        });
    };
    getAllComments = async (params) => {
        const post = await this.postRepository.findById(params.postId);
        if (!post) {
            throw new exceptions_1.NotFoundError("Post is not available can not get comments");
        }
        if (post) {
            if (post.commentsCount == 0) {
                throw new exceptions_1.BadRequestError("This post has no comments");
            }
            if (params.postId && params.parentId !== "") {
                console.log(params);
                const existingComment = await this.commentRepository.findById(params.parentId);
                if (!existingComment) {
                    throw new exceptions_1.NotFoundError("Comment not available or might be deleted");
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
}
exports.commentService = new CommentService(new DB_1.PostRepository(), new DB_1.CommentRepository(), new DB_1.UserReactionRepository());
