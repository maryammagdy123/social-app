"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const common_1 = require("../../common");
const exceptions_1 = require("../../common/exceptions");
const utils_1 = require("../../common/utils");
const DB_1 = require("../../DB");
const config_1 = require("../../config");
const init_1 = require("../../common/providers/email/nodemailer/init");
const init_2 = require("../../common/providers/cache/redis/init");
class AuthenticationService {
    emailProvider;
    userRepo;
    cacheProvider;
    constructor(emailProvider, userRepo, cacheProvider) {
        this.emailProvider = emailProvider;
        this.userRepo = userRepo;
        this.cacheProvider = cacheProvider;
    }
    signup = async (signupDTO) => {
        let { email, password, gender, username } = signupDTO;
        password = await (0, utils_1.hash)(password);
        const key = this.cacheProvider.key(email);
        const userExistInCache = await this.cacheProvider.checkKeyExistence(key);
        const userExistInDB = await this.userRepo.findOne({ email });
        if (userExistInCache === 1) {
            throw new exceptions_1.ConflictError("This email is already in use!");
        }
        if (userExistInDB) {
            throw new exceptions_1.BadRequestError("You already have an account ! login instead");
        }
        await this.cacheProvider.set(key, {
            email,
            password,
            gender,
            username,
        }, 86400);
        const otp = new common_1.OTP(email, this.emailProvider, this.cacheProvider);
        const generatedOTP = await otp.generateOTP(common_1.OTP_KEY_PURPOSE.CONFIRM_EMAIL);
        await this.emailProvider.send(otp.email, common_1.EmailEnum.CONFIRM_EMAIL, `Your OTP code is: ${generatedOTP}`);
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
        const user = await this.cacheProvider.get(this.cacheProvider.key(email));
        const confirmedInDB = await this.userRepo.findOne({ email });
        if (confirmedInDB?.isConfirmed) {
            throw new exceptions_1.BadRequestError("Your account already verified!");
        }
        if (user === null) {
            throw new exceptions_1.NotFoundError("No such account found please create account first!");
        }
        const verified = await new common_1.OTP(email, this.emailProvider, this.cacheProvider).verifyOTP(otp, common_1.OTP_KEY_PURPOSE.CONFIRM_EMAIL);
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
        await this.emailProvider.send(email, "Account Verified Successfully", `Welcome to our social media app, ${user.username}! We're excited to have you on board. Start connecting with friends and sharing your moments today!`);
        return data;
    };
    resendOtp = async (resendOtpDTO) => {
        const { email, type } = resendOtpDTO;
        const key = this.cacheProvider.key(email);
        const userExistInCache = await this.cacheProvider.checkKeyExistence(key);
        console.log(userExistInCache);
        const userExistInDB = await this.userRepo.findOne({ email });
        if (!userExistInCache && !userExistInDB) {
            throw new exceptions_1.NotFoundError("NO account registered with this email!");
        }
        if (userExistInDB && type === common_1.EmailEnum.CONFIRM_EMAIL) {
            throw new exceptions_1.BadRequestError("Cannot resend code!");
        }
        await new common_1.OTP(email, this.emailProvider, this.cacheProvider).resendOtp(common_1.OTP_KEY_PURPOSE.CONFIRM_EMAIL, type);
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
        await this.cacheProvider.saveSessions(userExist._id, sessionId, await (0, utils_1.hash)(refreshToken));
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
        const stored = await this.cacheProvider.get(this.cacheProvider.sessionKey(decoded.id, decoded.sessionId));
        const isMatch = await (0, utils_1.compare)(refreshToken, stored);
        if (!stored || !isMatch) {
            throw new exceptions_1.BadRequestError("Invalid session, please login again");
        }
        await this.cacheProvider.delete(this.cacheProvider.sessionKey(decoded.id, decoded.sessionId));
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
        await this.cacheProvider.saveSessions(decoded.id, sessionId, data.refreshToken);
        return data;
    };
    sessionLogout = async (token) => {
        const tokenService = new common_1.TokenService();
        const decoded = tokenService.verifyToken(token, config_1.ACCESS_TOKEN_SECRET_KEY);
        const deleted = await this.cacheProvider.delete(this.cacheProvider.sessionKey(decoded?.id, decoded?.sessionId));
        if (!deleted) {
            throw new exceptions_1.BadRequestError("Something went wrong, already  logged out !");
        }
        return true;
    };
    logoutAllSessions = async (userId) => {
        const sessions = await this.cacheProvider.sMembers(`user_sessions:${userId}`);
        for (const s of sessions) {
            await this.cacheProvider.delete(this.cacheProvider.sessionKey(userId, s));
        }
    };
}
exports.default = new AuthenticationService(init_1.nodemailerProvider, new DB_1.UserRepository(), init_2.redisService);
