import { Types } from "mongoose";
import { IPost } from "./post.interface";

export interface IComment {
  userId: Types.ObjectId;
  postId: Types.ObjectId|IPost[];
  parentId?: Types.ObjectId | undefined; //unary relationship .. a comment may has many replies and reply it sel is comment
  content?: string | undefined;
  attachment?: string;
  mentions?: Types.ObjectId[];
}
