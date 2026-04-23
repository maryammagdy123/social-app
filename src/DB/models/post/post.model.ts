import { model, Schema } from "mongoose";
import { PostDocument } from "../../../common/types/post.types";

export const schema = new Schema<PostDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    attachments: [String],
    commentsCount: {
      type: Number,
      default: 0,
    },
    reactionsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    commentDisabled:{
      type:Boolean,
      default:false //by default commenting on post is allowed
    }
  },
  {
    timestamps: true,
  },
);

export const PostModel = model("Post", schema);
