// import { Types } from "mongoose";
import z from "zod";
import {
  addCommentSchema,
  reactToCommentSchema,
} from "./validation/comment.validation";

// export interface IAddCommentDTO {
//   content?: string | undefined;
//   attachment?: string | undefined;
//   mentions?: Types.ObjectId[] | undefined;
// }

export type AddCommentDTO = z.infer<typeof addCommentSchema.body>;
export type ReactToCommentDTO = z.infer<typeof reactToCommentSchema.body>;
