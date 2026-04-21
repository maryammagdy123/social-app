// import { UserRepository } from "../../DB";
import { EmailEnum, OTP_KEY_PURPOSE } from "../enums";

import { BadRequestError, NotFoundError } from "../exceptions";
import { compare, generateOTP, hash, sendOTPEmail } from "../utils";
import { redisService } from "./redis.service";

export class OTP {
  constructor(public email: string) {}

  public generateOTP = async (keyPurpose: OTP_KEY_PURPOSE): Promise<string> => {
    const otp = generateOTP();
    await redisService.saveInCache(
      redisService.otpKey(this.email, keyPurpose),
      await hash(otp),
      300,
    );
    return otp;
  };

  public verifyOTP = async (otp: string, kyePurpose: OTP_KEY_PURPOSE) => {
    //check if user has an otp
    const key: string = redisService.otpKey(this.email, kyePurpose);
    if (!key) {
      throw new NotFoundError("No such key found!");
    }
    const cachedOTP = await redisService.getFromCache(key);
    if (!cachedOTP) {
      throw new NotFoundError("Cannot find OTP or expired!!");
    }
    //compare otp
    const isCompare = await compare(otp, cachedOTP);

    //check if the otp entered by user matches the one in the db
    if (!isCompare) {
      throw new BadRequestError("Invalid OTP");
    }

    await redisService.deleteFromCache(key);
    await redisService.deleteFromCache(redisService.key(this.email));

    return true;
  };

  public resendOtp = async (
    keyPurpose: OTP_KEY_PURPOSE,
    type: EmailEnum,
  ): Promise<void> => {
    //check if user's otp still valid
    const key = redisService.otpKey(this.email, keyPurpose);
    //if still valid it throws error
    await redisService.ensureTTL(key, 180);
    //if no otp , generate one and send email
    const otp = await this.generateOTP(keyPurpose);
    await sendOTPEmail(this.email, otp, type);
  };
}
