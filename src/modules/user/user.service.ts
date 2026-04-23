import { redisService, TokenService } from "../../common";
import { BadRequestError, NotFoundError } from "../../common/exceptions";
import { REFRESH_TOKEN_SECRET_KEY } from "../../config";

export class UserService {
  constructor(private readonly tokenService: TokenService) {}

  public sessionLogout = async (token: string) => {
    const decoded = this.tokenService.verifyToken(
      token,
      REFRESH_TOKEN_SECRET_KEY as string,
    );

    const deleted = await redisService.deleteFromCache(
      redisService.sessionKey(decoded?.id, decoded?.sessionId),
    );
    if (
      !(await redisService.sRem(
        redisService.allSessionsSetKey(decoded?.id),
        decoded?.sessionId,
      ))
    ) {
      throw new NotFoundError("session already expired");
    }
    if (!deleted) {
      throw new BadRequestError("Something went wrong, already  logged out !");
    }
    return true;
  };

  public logoutAllSessions = async (token: string) => {
    const decoded = this.tokenService.verifyToken(
      token,
      REFRESH_TOKEN_SECRET_KEY as string,
    );

    const userId = decoded?.id;

    // delete all set that contains all users devices sessions
    const sessions = await redisService.sMembers(
      redisService.allSessionsSetKey(userId),
    );
    await Promise.all(
      sessions.map((sessionId) =>
        redisService.sRem(redisService.allSessionsSetKey(userId), sessionId),
      ),
    );
    return true;
  };
}
export const userService = new UserService(new TokenService());
