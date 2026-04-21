import type { NextFunction, Request, Response } from "express";
import { redisService, RoleEnum, TokenService } from "../common";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../common/exceptions";
import { ACCESS_TOKEN_SECRET_KEY } from "../config";
import { UserRepository } from "../DB";

export const authenticateUser = (
  mode: string = "strict",
  roles: RoleEnum[] = [],
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepo = new UserRepository();
      const authHeader: string | undefined = req.headers.authorization;
      if (!authHeader) {
        if (mode === "strict") {
          throw new ForbiddenError("Login required", { authHeader });
        }
        return next();
      }

      const token: string = authHeader;
      const tokenService = new TokenService();
      const decoded = tokenService.verifyToken(
        token,
        ACCESS_TOKEN_SECRET_KEY as string,
      );
      if (!decoded) {
        console.log(decoded);
        throw new BadRequestError("Invalid token");
      }
      let { id, sessionId } = decoded;
      // console.log(decoded);
      const user = await userRepo.findById(id);
      // console.log(user);
      if (!user) {
        throw new NotFoundError("User Not found");
      }
      //check if this user session is blacklisted
      const isSessionValid = await redisService.sIsMember(
        redisService.allSessionsSetKey(id),
        sessionId,
      );
      if (!isSessionValid) {
        await redisService.deleteFromCache(
          redisService.sessionKey(id, sessionId),
        );
        throw new BadRequestError("Session expired , login again !");

      }
      req.user = user;
      
      // ✅ check roles
      if (roles.length > 0) {
        if (!roles.includes(user!.role)) {
          return res.status(403).json({
            message: "Forbidden: not authorized",
          });
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
