"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = void 0;
const post_1 = require("../../DB/models/post");
const exceptions_1 = require("../../common/exceptions");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
class CommentService {
    postRepository;
    commentRepository;
    constructor(postRepository, commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
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
}
exports.commentService = new CommentService(new post_1.PostRepository(), new comment_repository_1.CommentRepository());
