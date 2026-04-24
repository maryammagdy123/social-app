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
            refId: existingComment._id
        });
    };
}
exports.commentService = new CommentService(new DB_1.PostRepository(), new DB_1.CommentRepository(), new DB_1.UserReactionRepository());
