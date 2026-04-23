import { IComment } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { CommentModel } from "./comment.model";

export class CommentRepository extends AbstractDBRepository<IComment> {
  constructor() {
    super(CommentModel);
  }
}
