import { HydratedDocument } from "mongoose";
import { IComment } from "../interfaces";

export type CommentDocument = HydratedDocument<IComment>;
