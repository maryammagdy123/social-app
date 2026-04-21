"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const common_1 = require("../../common");
const exceptions_1 = require("../../common/exceptions");
const utils_1 = require("../../common/utils");
const DB_1 = require("../../DB");
const config_1 = require("../../config");
class AuthenticationService {
    userRepo;
    constructor() {
        this.userRepo = new DB_1.UserRepository();
    }
    signup = async (signupDTO) => {
        let { email, password, gender, username } = signupDTO;
        password = await (0, utils_1.hash)(password);
        const key = common_1.redisService.key(email);
        const userExistInCache = await common_1.redisService.checkKeyExistence(key);
        const userExistInDB = await this.userRepo.findOne({ email });
        if (userExistInCache === 1) {
            throw new exceptions_1.ConflictError("This email is already in use!");
        }
        if (userExistInDB) {
            throw new exceptions_1.BadRequestError("You already have an account ! login instead");
        }
        await common_1.redisService.saveInCache(key, {
            email,
            password,
            gender,
            username,
        }, 86400);
        const otp = new common_1.OTP(email);
        const generatedOTP = await otp.generateOTP(common_1.OTP_KEY_PURPOSE.CONFIRM_EMAIL);
        await (0, utils_1.sendOTPEmail)(otp.email, generatedOTP, common_1.EmailEnum.CONFIRM_EMAIL);
        const data = {
            success: true,
            status: 201,
            message: "Confirmation email sent to your email successfully",
            data: {
                email,
                username,
                gender,
            },
        };
        return data;
    };
    verifyAccount = async (confirmEmailDTO) => {
        let { email, otp } = confirmEmailDTO;
        const user = await common_1.redisService.getFromCache(common_1.redisService.key(email));
        const confirmedInDB = await this.userRepo.findOne({ email });
        if (confirmedInDB?.isConfirmed) {
            throw new exceptions_1.BadRequestError("Your account already verified!");
        }
        if (user === null) {
            throw new exceptions_1.NotFoundError("No such account found please create account first!");
        }
        const verified = await new common_1.OTP(email).verifyOTP(otp, common_1.OTP_KEY_PURPOSE.CONFIRM_EMAIL);
        if (!verified) {
            throw new exceptions_1.BadRequestError("Cannot verify account");
        }
        const createdUser = await this.userRepo.create(user);
        console.log(createdUser);
        const data = {
            status: 201,
            success: true,
            message: "Account verified successfully",
            data: createdUser,
        };
        return data;
    };
    resendOtp = async (resendOtpDTO) => {
        const { email, type } = resendOtpDTO;
        const key = common_1.redisService.key(email);
        const userExistInCache = await common_1.redisService.checkKeyExistence(key);
        console.log(userExistInCache);
        const userExistInDB = await this.userRepo.findOne({ email });
        if (!userExistInCache && !userExistInDB) {
            throw new exceptions_1.NotFoundError("NO account registered with this email!");
        }
        if (userExistInDB && type === common_1.EmailEnum.CONFIRM_EMAIL) {
            throw new exceptions_1.BadRequestError("Cannot resend code!");
        }
        await new common_1.OTP(email).resendOtp(common_1.OTP_KEY_PURPOSE.CONFIRM_EMAIL, type);
    };
    login = async (loginDTO) => {
        const token = new common_1.TokenService();
        const sessionId = (0, node_crypto_1.randomUUID)();
        const { email, password } = loginDTO;
        const userExist = await this.userRepo.findOne({ email });
        if (!userExist) {
            throw new exceptions_1.BadRequestError("Seems no registered account with this email , signup first!");
        }
        const passwordCompared = await (0, utils_1.compare)(password, userExist.password);
        if (!passwordCompared) {
            throw new exceptions_1.ForbiddenError("Email or password is incorrect ");
        }
        const accessToken = token.generateAccessToken({
            id: userExist._id,
            email: userExist.email,
            sessionId,
        });
        const refreshToken = token.generateRefreshToken({
            id: userExist._id,
            email: userExist.email,
            sessionId,
        });
        const data = {
            success: true,
            status: 200,
            message: "Login successfully",
            data: {
                accessToken,
                refreshToken,
            },
        };
        await common_1.redisService.saveSessions(userExist._id, sessionId, await (0, utils_1.hash)(refreshToken));
        return data;
    };
    refreshToken = async (refreshToken) => {
        console.log(refreshToken);
        const tokenService = new common_1.TokenService();
        const decoded = tokenService.verifyToken(refreshToken, config_1.REFRESH_TOKEN_SECRET_KEY);
        console.log(decoded);
        if (!decoded) {
            throw new exceptions_1.BadRequestError("Invalid token");
        }
        const stored = await common_1.redisService.getFromCache(common_1.redisService.sessionKey(decoded.id, decoded.sessionId));
        const isMatch = await (0, utils_1.compare)(refreshToken, stored);
        if (!stored || !isMatch) {
            throw new exceptions_1.BadRequestError("Invalid session, please login again");
        }
        await common_1.redisService.deleteFromCache(common_1.redisService.sessionKey(decoded.id, decoded.sessionId));
        const sessionId = (0, node_crypto_1.randomUUID)();
        const data = {
            accessToken: tokenService.generateAccessToken({
                id: decoded.id,
                email: decoded.email,
                sessionId,
            }),
            refreshToken: tokenService.generateRefreshToken({
                id: decoded.id,
                email: decoded.email,
                sessionId,
            }),
        };
        await common_1.redisService.saveSessions(decoded.id, sessionId, data.refreshToken);
        return data;
    };
    sessionLogout = async (token) => {
        const tokenService = new common_1.TokenService();
        const decoded = tokenService.verifyToken(token, config_1.ACCESS_TOKEN_SECRET_KEY);
        const deleted = await common_1.redisService.deleteFromCache(common_1.redisService.sessionKey(decoded?.id, decoded?.sessionId));
        if (!deleted) {
            throw new exceptions_1.BadRequestError("Something went wrong, already  logged out !");
        }
        return true;
    };
    logoutAllSessions = async () => {
    };
}
exports.default = new AuthenticationService();
