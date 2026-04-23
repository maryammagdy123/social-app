import { model, Schema } from "mongoose";
import { UserReactionDocument } from "../../../common/types/user-reaction.types";
import { ON_MODEL, REACTION_ENUM } from "../../../common";

const schema = new Schema<UserReactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    refId: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: true,
    },
    onModel: {
      type: String,
      enum: ON_MODEL,
      required: true,
    },
    type: {
      type: Number,
      enum: REACTION_ENUM,
    },
  },
  { timestamps: true },
);
export const ReactionModel = model("Reaction", schema);
