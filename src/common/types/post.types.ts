import { HydratedDocument } from "mongoose";
import { IPost } from "../interfaces";

export type PostDocument = HydratedDocument<IPost>;