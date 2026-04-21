import { IUser } from "../../../common";
import { AbstractDBRepository } from "../../repository/db.repository";
import { UserModel } from "./user.model";

export class UserRepository extends AbstractDBRepository<IUser> {
  constructor() {
    super(UserModel);
  }
}


