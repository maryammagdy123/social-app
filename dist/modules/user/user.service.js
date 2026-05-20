"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const common_1 = require("../../common");
const init_1 = require("../../common/providers/cache/redis/init");
const exceptions_1 = require("../../common/exceptions");
const config_1 = require("../../config");
const DB_1 = require("../../DB");
const block_repository_1 = require("../../DB/models/block/block.repository");
class UserService {
    tokenService;
    userRepo;
    postRepo;
    friendsRepo;
    blockRepo;
    constructor(tokenService, userRepo, postRepo, friendsRepo, blockRepo) {
        this.tokenService = tokenService;
        this.userRepo = userRepo;
        this.postRepo = postRepo;
        this.friendsRepo = friendsRepo;
        this.blockRepo = blockRepo;
    }
    sessionLogout = async (token) => {
        const decoded = this.tokenService.verifyToken(token, config_1.REFRESH_TOKEN_SECRET_KEY);
        const deleted = await init_1.redisService.delete(init_1.redisService.sessionKey(decoded?.id, decoded?.sessionId));
        if (!(await init_1.redisService.sRem(init_1.redisService.allSessionsSetKey(decoded?.id), decoded?.sessionId))) {
            throw new exceptions_1.NotFoundError("session already expired");
        }
        if (!deleted) {
            throw new exceptions_1.BadRequestError("Something went wrong, already  logged out !");
        }
        return true;
    };
    logoutAllSessions = async (token) => {
        const decoded = this.tokenService.verifyToken(token, config_1.REFRESH_TOKEN_SECRET_KEY);
        const userId = decoded?.id;
        const sessions = await init_1.redisService.sMembers(init_1.redisService.allSessionsSetKey(userId));
        await Promise.all(sessions.map((sessionId) => init_1.redisService.sRem(init_1.redisService.allSessionsSetKey(userId), sessionId)));
        return true;
    };
    getUserProfile = async (profileOwnerId, viewerId) => {
        const user = await this.userRepo.findById(profileOwnerId);
        if (!user)
            throw new exceptions_1.NotFoundError("User not found");
        if (viewerId) {
            const isBlocked = await this.blockRepo.findOne({
                user: viewerId,
                blockedBy: user._id,
            });
            if (isBlocked) {
                throw new exceptions_1.NotFoundError("User not found");
            }
        }
        if (user.profilePrivacy === common_1.ProfilePrivacy.PROTECTED &&
            !(viewerId && viewerId.equals(profileOwnerId))) {
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
                throw new exceptions_1.ForbiddenError("This profile is protected, only friends can view it");
            }
        }
        const posts = await this.postRepo.find({ userId: profileOwnerId });
        return { user, posts };
    };
    myProfile = async (me) => {
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
                .populate([
                "user",
                "friend",
            ]),
        ]);
        return {
            userProfile: user,
            posts,
            friends: friends.map((f) => {
                return f.user._id.toString() === me.toString()
                    ? f.friend
                    : f.user;
            }),
        };
    };
}
exports.UserService = UserService;
exports.userService = new UserService(new common_1.TokenService(), new DB_1.UserRepository(), new DB_1.PostRepository(), new DB_1.UserFriendRepository(), new block_repository_1.BlockRepository());
