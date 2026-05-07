import { REDIS_URL } from "../../../../config";
import { RedisService } from "./redis.service";

export const redisService = new RedisService({
  url: REDIS_URL as string,
});
