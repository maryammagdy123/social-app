import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { authRouter, postRouter } from "./modules";
import { globalErrorHandler } from "./middlewares";
import { authenticateDB } from "./DB";
import { redisService } from "./common/services";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user";
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
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/post", postRouter);
  app.get("/*dummy", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json("Not Found");
  });
  app.use(globalErrorHandler);
  app.listen(3000, () => {
    console.log("Application is listening on port 3000");
  });
};
export default bootstrap;
