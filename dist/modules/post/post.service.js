"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.PostService = void 0;
const post_1 = require("../../DB/models/post");
const exceptions_1 = require("../../common/exceptions");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
const common_1 = require("../../common");
class PostService {
    postRepo;
    userReactionRepo;
    constructor(postRepo, userReactionRepo) {
        this.postRepo = postRepo;
        this.userReactionRepo = userReactionRepo;
    }
    createPost = async (createPostDTO, userId) => {
        return await this.postRepo.create({
            ...createPostDTO,
            userId,
        });
    };
    reactToPost = async (postReactionDTO, userId) => {
        const post = await this.postRepo.findById(postReactionDTO.postId);
        if (!post) {
            throw new exceptions_1.NotFoundError("post not found");
        }
        const existingReaction = await this.userReactionRepo.findOne({
            userId,
            refId: postReactionDTO.postId,
        });
        if (!existingReaction) {
            await this.postRepo.updateOne({ _id: postReactionDTO.postId }, { $inc: { reactionsCount: 1 } });
            return await this.userReactionRepo.create({
                onModel: common_1.ON_MODEL.Post,
                type: postReactionDTO.type,
                refId: post._id,
                userId,
            });
        }
        if (existingReaction.type !== postReactionDTO.type) {
            existingReaction.type = postReactionDTO.type;
            return await existingReaction.save();
        }
        if (post.reactionsCount !== 0) {
            await this.postRepo.updateOne({ _id: postReactionDTO.postId }, { $inc: { reactionsCount: -1 } });
        }
        return await this.userReactionRepo.findByIdAndDelete(existingReaction._id);
    };
}
exports.PostService = PostService;
exports.postService = new PostService(new post_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository());
