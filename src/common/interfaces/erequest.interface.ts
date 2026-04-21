import { UserDocument } from "../types/user.types";


declare module "express-serve-static-core" {
  export interface Request {
    user: UserDocument;
  }
}
