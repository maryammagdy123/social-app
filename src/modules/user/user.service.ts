import { IUser, ProfilePrivacy, TokenService, UserDocument } from "../../common";
import { redisService } from "../../common/providers/cache/redis/init";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../common/exceptions";
import { REFRESH_TOKEN_SECRET_KEY } from "../../config";
import { Types } from "mongoose";
import { PostRepository, UserFriendRepository, UserRepository } from "../../DB";
import { BlockRepository } from "../../DB/models/block/block.repository";
import { IProfileResponse } from "./user.entities";

export class UserService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepository,
    private readonly postRepo: PostRepository,
    private readonly friendsRepo: UserFriendRepository,
    private readonly blockRepo: BlockRepository,
  ) {}

  public sessionLogout = async (token: string) => {
    const decoded = this.tokenService.verifyToken(
      token,
      REFRESH_TOKEN_SECRET_KEY as string,
    );

    const deleted = await redisService.delete(
      redisService.sessionKey(decoded?.id, decoded?.sessionId),
    );
    if (
      !(await redisService.sRem(
        redisService.allSessionsSetKey(decoded?.id),
        decoded?.sessionId,
      ))
    ) {
      throw new NotFoundError("session already expired");
    }
    if (!deleted) {
      throw new BadRequestError("Something went wrong, already  logged out !");
    }
    return true;
  };

  public logoutAllSessions = async (token: string) => {
    const decoded = this.tokenService.verifyToken(
      token,
      REFRESH_TOKEN_SECRET_KEY as string,
    );

    const userId = decoded?.id;

    // delete all set that contains all users devices sessions
    const sessions = await redisService.sMembers(
      redisService.allSessionsSetKey(userId),
    );
    await Promise.all(
      sessions.map((sessionId) =>
        redisService.sRem(redisService.allSessionsSetKey(userId), sessionId),
      ),
    );
    return true;
  };

  //this should return users data and published posts
  /**
   * userId is the profile owner
   *
   */
  public getUserProfile = async (
    profileOwnerId: Types.ObjectId,
    viewerId: Types.ObjectId | null,
  ) => {
    const user = await this.userRepo.findById(profileOwnerId);

    if (!user) throw new NotFoundError("User not found");
    //check if the user is blocked by the profile owner or not
    if (viewerId) {
      const isBlocked = await this.blockRepo.findOne({
        user: viewerId,
        blockedBy: user._id,
      });
      if (isBlocked) {
        throw new NotFoundError("User not found");
      }
    }

    //in case the user's profile is protected only shown to friends
    if (
      user.profilePrivacy === ProfilePrivacy.PROTECTED &&
      !(viewerId && viewerId.equals(profileOwnerId))
    ) {
      //check if the user is a friend of the profile owner or not
      const isFriend = await this.friendsRepo.findOne({
        $or: [
          {
            user: viewerId,
            friend: profileOwnerId,
          },
          {
            user: profileOwnerId,
            friend: viewerId,
          },
        ],
      });
      if (!isFriend) {
        throw new ForbiddenError(
          "This profile is protected, only friends can view it",
        );
      }
    }
    const posts = await this.postRepo.find({ userId: profileOwnerId });
    return { user, posts };
  };



  public myProfile = async (me: Types.ObjectId): Promise<IProfileResponse> => {
    const [user, posts, friends] = await Promise.all([
      this.userRepo.findById(me),
      this.postRepo.find({ userId: me }),
       this.friendsRepo
      .find({
        $or: [
          { user: me },
          { friend: me },
        ],
      })
      .populate<{ user:UserDocument; friend: IUser }>([
        "user",
        "friend",
      ]),
    ]);
    return {
      userProfile: user!,
      posts,

    friends: friends.map((f) => {
      return f.user._id.toString() === me.toString()
        ? f.friend
        : f.user;
    }),

    };
  };
}
export const userService = new UserService(
  new TokenService(),
  new UserRepository(),
  new PostRepository(),
  new UserFriendRepository(),
  new BlockRepository(),
);
