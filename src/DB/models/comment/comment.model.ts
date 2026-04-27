import { model, Schema } from "mongoose";
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
commentSchema.pre("deleteOne", async function () {
  console.log(this);
  const filter = this.getFilter();
  const replies = await this.model.find({ parentId: filter._id });
  if (replies.length) {
    for (const reply of replies) {
      await this.model.deleteOne({ _id: reply._id });
    }
  }
});
export const CommentModel = model("Comment", commentSchema);
