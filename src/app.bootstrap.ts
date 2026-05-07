import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {
  authRouter,
  commentRouter,
  friendRouter,
  postRouter,
  requestRouter,
} from "./modules";
import { globalErrorHandler } from "./middlewares";
import { authenticateDB } from "./DB";

import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user";
import { redisService } from "./common/providers/cache/redis/init";
const bootstrap = async () => {
  console.log("Bootstrapping the application...");
  const app: express.Express = express();
  await authenticateDB();
  await redisService.connect();
  app.use(express.json());
  app.use(cookieParser());
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json("Hello, World!");
  });
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/request", requestRouter);
  app.use("/friend", friendRouter);
  app.use("/comment", commentRouter);
  app.get("/*dummy", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json("Not Found");
  });
  app.use(globalErrorHandler);
  app.listen(3000, () => {
    console.log("Application is listening on port 3000");
  });
};
export default bootstrap;
