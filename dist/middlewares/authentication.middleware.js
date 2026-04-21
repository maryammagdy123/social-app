"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const common_1 = require("../common");
const exceptions_1 = require("../common/exceptions");
const config_1 = require("../config");
const DB_1 = require("../DB");
const authenticateUser = (mode = "strict", roles = []) => {
    return async (req, res, next) => {
        try {
            const userRepo = new DB_1.UserRepository();
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                if (mode === "strict") {
                    throw new exceptions_1.ForbiddenError("Login required", { authHeader });
                }
                return next();
            }
            const token = authHeader;
            const tokenService = new common_1.TokenService();
            const decoded = tokenService.verifyToken(token, config_1.ACCESS_TOKEN_SECRET_KEY);
            if (!decoded) {
                console.log(decoded);
                throw new exceptions_1.BadRequestError("Invalid token");
            }
            let { id, sessionId } = decoded;
            const user = await userRepo.findById(id);
            if (!user) {
                throw new exceptions_1.NotFoundError("User Not found");
            }
            const isSessionValid = await common_1.redisService.sIsMember(common_1.redisService.allSessionsSetKey(id), sessionId);
            if (!isSessionValid) {
                await common_1.redisService.deleteFromCache(common_1.redisService.sessionKey(id, sessionId));
                throw new exceptions_1.BadRequestError("Session expired , login again !");
            }
            req.user = user;
            if (roles.length > 0) {
                if (!roles.includes(user.role)) {
                    return res.status(403).json({
                        message: "Forbidden: not authorized",
                    });
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authenticateUser = authenticateUser;
