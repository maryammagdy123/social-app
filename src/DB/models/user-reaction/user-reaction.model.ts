import { model, Schema, Types } from "mongoose";
import { UserReactionDocument } from "../../../common/types/user-reaction.types";
import { ON_MODEL, REACTION_ENUM } from "../../../common";

const schema = new Schema<UserReactionDocument>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    refId: {
      type: Types.ObjectId,
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
