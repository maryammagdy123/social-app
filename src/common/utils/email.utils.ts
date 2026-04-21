import nodemailer from "nodemailer";
import { SMTP_PASSWORD_KEY, SMTP_USER } from "../../config/config.service.js";
import { EmailEnum } from "../enums/email.enum.js";

export const sendOTPEmail = async (
  email: string,
  otp: string,
  subject: EmailEnum,
  text = `Your OTP code is: ${otp}`,
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD_KEY,
    },
  });

  const mailOptions = {
    from: '"Social Media App" <no-reply@social.com>',
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
