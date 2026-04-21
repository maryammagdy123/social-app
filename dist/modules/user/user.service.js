"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const common_1 = require("../../common");
const exceptions_1 = require("../../common/exceptions");
const config_1 = require("../../config");
class UserService {
    tokenService;
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    sessionLogout = async (token) => {
        const decoded = this.tokenService.verifyToken(token, config_1.REFRESH_TOKEN_SECRET_KEY);
        const deleted = await common_1.redisService.deleteFromCache(common_1.redisService.sessionKey(decoded?.id, decoded?.sessionId));
        if (!(await common_1.redisService.sRem(common_1.redisService.allSessionsSetKey(decoded?.id), decoded?.sessionId))) {
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
        const sessions = await common_1.redisService.sMembers(common_1.redisService.allSessionsSetKey(userId));
        await Promise.all(sessions.map((sessionId) => common_1.redisService.sRem(common_1.redisService.allSessionsSetKey(userId), sessionId)));
        return true;
    };
}
exports.UserService = UserService;
exports.userService = new UserService(new common_1.TokenService());
