import { IPost, IUser } from "../../common";

export interface IProfileResponse {
  userProfile: IUser;
  posts: IPost[];
  friends: IUser[];
}
