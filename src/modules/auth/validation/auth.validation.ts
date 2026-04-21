import z from "zod";
import { EmailEnum, GenderEnum, ProviderEnum, RoleEnum } from "../../../common";

export const loginSchema = {
  body: z.strictObject({
    email: z.string().email(),
    password: z.string().min(8, { error: "invalid password!" }),
  }),
};
export const signupSchema = {
  body: loginSchema.body.safeExtend({
    username: z
      .string()
      .min(2, { error: "Username must be at least 2 characters !" })
      .max(20, { error: "Maximum length is 20 character!" }),
    role: z.enum(RoleEnum).default(RoleEnum.user),
    gender: z.enum(GenderEnum).default(GenderEnum.male),
    provider: z.enum(ProviderEnum).default(ProviderEnum.system),
  }),
};
export const confirmEmailSchema = {
  body: z.strictObject({
    email: z.string().email(),
    otp: z.string().length(6, { error: "Invalid OTP length" }),
  }),
};

export const resendOtpSchema = {
  body: z.strictObject({
    email: z.string().email(),
    type: z.enum(EmailEnum),
  }),
};
