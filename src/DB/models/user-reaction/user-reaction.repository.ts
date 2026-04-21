import { UserReactionDocument } from "../../../common/types/user-reaction.types";
import { AbstractDBRepository } from "../../repository/db.repository";
import { ReactionModel } from "./user-reaction.model";

export class UserReactionRepository extends AbstractDBRepository<UserReactionDocument> {
  constructor() {
    super(ReactionModel);
  }
}
