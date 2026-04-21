import Router, { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

import { authenticateUser } from "../../middlewares";

const router = Router();
router.post(
  "/logout",
    authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(204);
    await userService.sessionLogout(refreshToken);
    res.clearCookie("refreshToken", {
      path: "/",
    });

    return res.sendStatus(204);
  },
);

router.post(
  "/logout/all",
  authenticateUser("strict"),
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(204);
    await userService.logoutAllSessions(refreshToken);
    res.clearCookie("refreshToken", {
      path: "/",
    });

    return res.sendStatus(204);
  },
);
export default router;
