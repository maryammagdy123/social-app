// import { UserRepository } from "../../DB";
import { EmailEnum, OTP_KEY_PURPOSE } from "../enums";

import { BadRequestError, NotFoundError } from "../exceptions";
import { ICacheProvider } from "../providers/cache/cache.interface";
import { IEmailProvider } from "../providers/email/email.interface";
import { compare, generateOTP, hash } from "../utils";


export class OTP {
  constructor(
    public email: string,
    private readonly emailProvider: IEmailProvider,
     private readonly cacheProvider: ICacheProvider,
  ) {}

  public generateOTP = async (keyPurpose: OTP_KEY_PURPOSE): Promise<string> => {
    const otp = generateOTP();
    await this.cacheProvider.set(
      this.cacheProvider.otpKey(this.email, keyPurpose),
      await hash(otp),
      300,
    );
    return otp;
  };

  public verifyOTP = async (otp: string, kyePurpose: OTP_KEY_PURPOSE) => {
    //check if user has an otp
    const key: string = this.cacheProvider.otpKey(this.email, kyePurpose);
    if (!key) {
      throw new NotFoundError("No such key found!");
    }
    const cachedOTP:string|null = await this.cacheProvider.get(key);
    if (!cachedOTP) {
      throw new NotFoundError("Cannot find OTP or expired!!");
    }
    //compare otp
    const isCompare = await compare(otp, cachedOTP as string);

    //check if the otp entered by user matches the one in the db
    if (!isCompare) {
      throw new BadRequestError("Invalid OTP");
    }

    await this.cacheProvider.delete(key);
    await this.cacheProvider.delete(this.cacheProvider.key(this.email));

    return true;
  };

  public resendOtp = async (
    keyPurpose: OTP_KEY_PURPOSE,
    type: EmailEnum,
  ): Promise<void> => {
    //check if user's otp still valid
    const key = this.cacheProvider.otpKey(this.email, keyPurpose);
    //if still valid it throws error
    await this.cacheProvider.ensureTTL(key, 180);
    //if no otp , generate one and send email
    const otp = await this.generateOTP(keyPurpose);
    // await sendOTPEmail(this.email, otp, type);
    await this.emailProvider.send(this.email, type, `Your OTP code is: ${otp}`);
  };
}
