import { GenderEnum, ProviderEnum, RoleEnum } from "../enums";

export interface IUser {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  coverPhotos?: string;
  bio?: string;
  DOB: Date;
  gender: GenderEnum;
  role: RoleEnum;
  provider: ProviderEnum;
  isConfirmed: boolean;
}
