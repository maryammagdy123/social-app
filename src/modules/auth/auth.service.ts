import { randomUUID } from "node:crypto";
import {
  EmailEnum,
  IUser,
  OTP,
  OTP_KEY_PURPOSE,
  TokenService,
} from "../../common";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../common/exceptions";
import { compare, hash } from "../../common/utils";
import { UserRepository } from "../../DB";
import { ConfirmEmailDTO, LoginDTO, resendOtpDTO, SignupDTO } from "./auth.dto";
import {
  IConfirmEmail,
  ILoginResponse,
  ISignup,
  ITokens,
} from "./auth.entities";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../../config";
import { Types } from "mongoose";

import { nodemailerProvider } from "../../common/providers/email/nodemailer/init";
import { IEmailProvider } from "../../common/providers/email/email.interface";
import { ICacheProvider } from "../../common/providers/cache/cache.interface";
import { redisService } from "../../common/providers/cache/redis/init";

class AuthenticationService {
  constructor(
    private readonly emailProvider: IEmailProvider,
    private readonly userRepo: UserRepository,
    private readonly cacheProvider: ICacheProvider,
  ) {}

  public signup = async (signupDTO: SignupDTO): Promise<ISignup> => {
    let { email, password, gender, username } = signupDTO;
    password = await hash(password);
    const key = this.cacheProvider.key(email);
    const userExistInCache = await this.cacheProvider.checkKeyExistence(key);
    const userExistInDB = await this.userRepo.findOne({ email });

    if (userExistInCache === 1) {
      throw new ConflictError("This email is already in use!");
    }
    if (userExistInDB) {
      throw new BadRequestError("You already have an account ! login instead");
    }
    await this.cacheProvider.set(
      key,
      {
        email,
        password,
        gender,
        username,
      },
      86400,
    );

    const otp = new OTP(email, this.emailProvider, this.cacheProvider);
    const generatedOTP = await otp.generateOTP(OTP_KEY_PURPOSE.CONFIRM_EMAIL);
    // await sendOTPEmail(otp.email, generatedOTP, EmailEnum.CONFIRM_EMAIL);
    await this.emailProvider.send(
      otp.email,
      EmailEnum.CONFIRM_EMAIL,
      `Your OTP code is: ${generatedOTP}`,
    );
    const data: ISignup = {
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

  public verifyAccount = async (
    confirmEmailDTO: ConfirmEmailDTO,
  ): Promise<IConfirmEmail> => {
    let { email, otp } = confirmEmailDTO;
    const user = await this.cacheProvider.get<IUser>(
      this.cacheProvider.key(email),
    );
    const confirmedInDB = await this.userRepo.findOne({ email });
    if (confirmedInDB?.isConfirmed) {
      throw new BadRequestError("Your account already verified!");
    }

    if (user === null) {
      throw new NotFoundError(
        "No such account found please create account first!",
      );
    }

    //verify otp
    const verified = await new OTP(
      email,
      this.emailProvider,
      this.cacheProvider,
    ).verifyOTP(otp, OTP_KEY_PURPOSE.CONFIRM_EMAIL);

    if (!verified) {
      throw new BadRequestError("Cannot verify account");
    }
    //save user into db  => isConfirmed -- true
    const createdUser = await this.userRepo.create(user as IUser);
    console.log(createdUser);

    const data: IConfirmEmail = {
      status: 201,
      success: true,
      message: "Account verified successfully",
      data: createdUser,
    };
    await this.emailProvider.send(
      email,
      "Account Verified Successfully",
      `Welcome to our social media app, ${(user as IUser).username}! We're excited to have you on board. Start connecting with friends and sharing your moments today!`,
    );
    return data;
  };

  public resendOtp = async (resendOtpDTO: resendOtpDTO): Promise<void> => {
    const { email, type } = resendOtpDTO;
    const key = this.cacheProvider.key(email);
    const userExistInCache = await this.cacheProvider.checkKeyExistence(key);
    console.log(userExistInCache);
    const userExistInDB = await this.userRepo.findOne({ email });
    if (!userExistInCache && !userExistInDB) {
      throw new NotFoundError("NO account registered with this email!");
    }
    if (userExistInDB && type === EmailEnum.CONFIRM_EMAIL) {
      throw new BadRequestError("Cannot resend code!");
    }
    await new OTP(email, this.emailProvider, this.cacheProvider).resendOtp(
      OTP_KEY_PURPOSE.CONFIRM_EMAIL,
      type,
    );
  };

  public login = async (loginDTO: LoginDTO): Promise<ILoginResponse> => {
    const token = new TokenService();
    const sessionId = randomUUID();
    const { email, password } = loginDTO;
    const userExist = await this.userRepo.findOne({ email });
    if (!userExist) {
      throw new BadRequestError(
        "Seems no registered account with this email , signup first!",
      );
    }

    const passwordCompared = await compare(password, userExist.password);
    if (!passwordCompared) {
      throw new ForbiddenError("Email or password is incorrect ");
    }
    //integrate with firebase for notifications
    if (loginDTO.FCM) {
      await this.cacheProvider.addToSet(`${userExist._id}:FCM`, loginDTO.FCM);
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
    const data: ILoginResponse = {
      success: true,
      status: 200,
      message: "Login successfully",
      data: {
        accessToken,
        refreshToken,
      },
    };

    //saving session - hash refresh token(todo)
    await this.cacheProvider.saveSessions(
      userExist._id,
      sessionId,
      await hash(refreshToken),
    );
    return data;
  };

  public refreshToken = async (refreshToken: string): Promise<ITokens> => {
    //m3aya mn el request access(session id , user id)
    console.log(refreshToken);
    const tokenService = new TokenService();

    const decoded = tokenService.verifyToken(
      refreshToken,
      REFRESH_TOKEN_SECRET_KEY as string,
    );
    console.log(decoded);
    if (!decoded) {
      throw new BadRequestError("Invalid token");
    }
    const stored = await this.cacheProvider.get(
      this.cacheProvider.sessionKey(decoded.id, decoded.sessionId),
    );
    const isMatch = await compare(refreshToken, stored as string);
    if (!stored || !isMatch) {
      throw new BadRequestError("Invalid session, please login again");
    }
    //  delete the old one
    await this.cacheProvider.delete(
      this.cacheProvider.sessionKey(decoded.id, decoded.sessionId),
    );
    //delete set

    //creating new sessionId

    const sessionId = randomUUID();

    const data: ITokens = {
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
    //saving new sessions
    await this.cacheProvider.saveSessions(
      decoded.id,
      sessionId,
      data.refreshToken,
    );

    return data;
  };

  //logout from specific device (session)
  public sessionLogout = async (token: string) => {
    /**
     * TODO  1- delete FCM token from set of FCM tokens for this user (if exist)
     * TODO 2- integrate with firebase to delete device token from firebase to stop sending notifications to this device
     */
    const tokenService = new TokenService();

    const decoded = tokenService.verifyToken(
      token,
      ACCESS_TOKEN_SECRET_KEY as string,
    );

    const deleted = await this.cacheProvider.delete(
      this.cacheProvider.sessionKey(decoded?.id, decoded?.sessionId),
    );
    if (!deleted) {
      throw new BadRequestError("Something went wrong, already  logged out !");
    }
    return true;
  };
  //logout from all devices (sessions)
  public logoutAllSessions = async (userId: Types.ObjectId) => {
    const sessions = await this.cacheProvider.sMembers(
      `user_sessions:${userId}`,
    );

    for (const s of sessions) {
      await this.cacheProvider.delete(this.cacheProvider.sessionKey(userId, s));
    }
  };
}

export default new AuthenticationService(
  nodemailerProvider,
  new UserRepository(),
  redisService,
);
