"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.PostService = void 0;
const mongoose_1 = require("mongoose");
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
        let { attachments, content } = createPostDTO;
        return await this.postRepo.create({
            attachments,
            content,
            userId,
        });
    };
    reactToPost = async (postReactionDTO, userId) => {
        const postExist = await this.postRepo.findById(postReactionDTO.postId);
        if (!postExist) {
            throw new exceptions_1.NotFoundError("can not react to this post , post is unavailable right now");
        }
        const userReacted = await this.userReactionRepo.findOne({
            userId,
            refId: postReactionDTO.postId,
        });
        if (!userReacted) {
            return await this.userReactionRepo.create({
                onModel: common_1.ON_MODEL.Post,
                type: postReactionDTO.type,
                refId: new mongoose_1.Types.ObjectId(postReactionDTO.postId),
                userId,
            });
        }
        if (userReacted) {
            if (userReacted.type !== postReactionDTO.type) {
                userReacted.type = postReactionDTO.type;
                await userReacted.save();
                await this.postRepo.updateOne({ _id: postReactionDTO.postId }, { $inc: { reactionsCount: 1 } });
            }
        }
        return await this.userReactionRepo.findByIdAndDelete(postReactionDTO.postId);
    };
}
exports.PostService = PostService;
exports.postService = new PostService(new post_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository());
