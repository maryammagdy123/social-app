"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = exports.UserResolver = void 0;
const common_1 = require("../../../common");
const exceptions_1 = require("../../../common/exceptions");
const config_1 = require("../../../config");
const user_service_1 = require("../user.service");
class UserResolver {
    userService;
    tokenService;
    constructor(userService, tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }
    getMyProfile = async (parent, args, context) => {
        const decoded = this.tokenService.verifyToken(context.req.headers.authorization, config_1.ACCESS_TOKEN_SECRET_KEY);
        if (!decoded)
            throw new exceptions_1.BadRequestError("Token is required");
        const profile = await this.userService.myProfile(decoded.id);
        console.log({ profile });
        return { ...profile, message: "done" };
    };
}
exports.UserResolver = UserResolver;
exports.userResolver = new UserResolver(user_service_1.userService, new common_1.TokenService());
