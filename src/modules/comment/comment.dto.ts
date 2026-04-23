import { Types } from "mongoose";

export interface IAddCommentDTO {
  content?: string | undefined;
  attachment?: string | undefined;
  mentions?: Types.ObjectId[] | undefined;
}
