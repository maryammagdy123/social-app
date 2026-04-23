import { model, Schema,  } from "mongoose";
import { CommentDocument } from "../../../common/types/comment.types";

const commentSchema = new Schema<CommentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attachment: String,
    content: String,
  },
  { timestamps: true },
);
export const CommentModel = model("Comment", commentSchema);
