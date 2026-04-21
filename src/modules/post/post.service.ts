import { Types } from "mongoose";
import { CreatePostDTO, PostReactionDTO } from "./post.dto";
import { PostRepository } from "../../DB/models/post";
import { NotFoundError } from "../../common/exceptions";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import { ON_MODEL } from "../../common";

export class PostService {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly userReactionRepo: UserReactionRepository,
  ) {}

  public createPost = async (
    createPostDTO: CreatePostDTO,
    userId: Types.ObjectId,
  ) => {
    let { attachments, content } = createPostDTO;
    return await this.postRepo.create({
      attachments,
      content,
      userId,
    });
  };

  reactToPost = async (
    postReactionDTO: PostReactionDTO,
    userId: Types.ObjectId,
  ) => {
    //check post existence
    const postExist = await this.postRepo.findById(postReactionDTO.postId);
    if (!postExist) {
      throw new NotFoundError(
        "can not react to this post , post is unavailable right now",
      );
    }
    //check if user has been reacted already , if not add a reaction
    const userReacted = await this.userReactionRepo.findOne({
      userId,
      refId: postReactionDTO.postId,
    });
    if (!userReacted) {
      return await this.userReactionRepo.create({
        onModel: ON_MODEL.Post,
        type: postReactionDTO.type,
        refId: new Types.ObjectId(postReactionDTO.postId),
        userId,
      });
    }
    //if user add the same reaction to the post , then the reaction has to be removed
    if (userReacted) {
      if (userReacted.type !== postReactionDTO.type) {
        userReacted.type = postReactionDTO.type;
        await userReacted.save();
       await this.postRepo.updateOne({_id:postReactionDTO.postId},{$inc:{reactionsCount:1}})
      }

    }

    return await this.userReactionRepo.findByIdAndDelete(postReactionDTO.postId);
  };
}
export const postService = new PostService(
  new PostRepository(),
  new UserReactionRepository(),
);
