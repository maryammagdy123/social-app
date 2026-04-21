import { HydratedDocument } from "mongoose";
import { IUserReaction } from "../interfaces";

export type UserReactionDocument = HydratedDocument<IUserReaction>;
