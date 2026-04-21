import z from "zod";
import * as validator from "./validation/auth.validation";

export type SignupDTO = z.infer<typeof validator.signupSchema.body>;
export type LoginDTO = z.infer<typeof validator.loginSchema.body>;
export type ConfirmEmailDTO = z.infer<typeof validator.confirmEmailSchema.body>;
export type resendOtpDTO = z.infer<typeof validator.resendOtpSchema.body>;
