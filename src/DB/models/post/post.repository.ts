import { IPost } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { PostModel } from "./post.model";

export class PostRepository extends AbstractDBRepository<IPost> {
  constructor() {
    super(PostModel);
  }
}
