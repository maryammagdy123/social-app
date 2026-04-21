import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import authService from "./auth.service";
import { validation } from "../../middlewares";
import {
  confirmEmailSchema,
  loginSchema,
  resendOtpSchema,
  signupSchema,
} from "./validation/auth.validation";
import { successResponse } from "../../common/response";
import { authenticateUser } from "../../middlewares/authentication.middleware";
import { RoleEnum } from "../../common";
import { BadRequestError } from "../../common/exceptions";
const router = Router();
//register
router.post(
  "/register",
  validation(signupSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    // Registration logic here
    const data = await authService.signup(req.body);

    successResponse({
      res,
      message: data.message,
      status: data.status,
      data: data.data,
    });
  },
);

router.post(
  "/verify-account",
  validation(confirmEmailSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.verifyAccount(req.body);

    successResponse({
      res,
      message: data.message,
      status: data.status,
      data: data.data,
    });
  },
);

router.post(
  "/resend-otp",
  validation(resendOtpSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    await authService.resendOtp(req.body);
    successResponse({
      res,
      message: "Code resent to your email successfully",
      status: 201,
    });
  },
);
router.post(
  "/login",
  validation(loginSchema.body),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.login(req.body);
    res.cookie("refreshToken", data.data?.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 100,
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    successResponse({
      res,
      message: data.message,
      status: data.status,
      data: data,
    });
  },
);

router.post(
  "/refresh-token",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError("Session expired");
    }
    const data = await authService.refreshToken(refreshToken);
    res.cookie("refreshToken", data.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 100,
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    successResponse({
      res,
      message: "Access token refreshed successfully!",
      data,
    });
  },
);

export default router;
