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

    return await this.postRepo.create({
...createPostDTO,
      userId,
    });
  };

reactToPost = async (
  postReactionDTO: PostReactionDTO,
  userId: Types.ObjectId,
) => {
  const post = await this.postRepo.findById(postReactionDTO.postId);

  if (!post) {
    throw new NotFoundError("post not found");
  }

  const existingReaction = await this.userReactionRepo.findOne({
    userId,
    refId: postReactionDTO.postId,
  });

  //  add reaction
  if (!existingReaction) {
    await this.postRepo.updateOne(
      { _id: postReactionDTO.postId },
      { $inc: { reactionsCount: 1 } }
    );

    return await this.userReactionRepo.create({
      onModel: ON_MODEL.Post,
      type: postReactionDTO.type,
      refId: post._id,
      userId,
    });
  }

  //  change reaction type
  if (existingReaction.type !== postReactionDTO.type) {
    existingReaction.type = postReactionDTO.type;
    return await existingReaction.save();
  }

  // remove reaction
 if(post.reactionsCount!==0){
 await this.postRepo.updateOne(
    { _id: postReactionDTO.postId },
    { $inc: { reactionsCount: -1 } }
  );
 }

  return await this.userReactionRepo.findByIdAndDelete(existingReaction._id);
};
}
export const postService = new PostService(
  new PostRepository(),
  new UserReactionRepository(),
);
