import { Types } from "mongoose";
import { ON_MODEL, REACTION_ENUM } from "../enums";

export interface IUserReaction {
  userId: Types.ObjectId;
  refId: Types.ObjectId;
  onModel: ON_MODEL;
  type: REACTION_ENUM;
}
