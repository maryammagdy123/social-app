import { model, Schema } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
  UserDocument,
} from "../../../common";

export const schema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    provider: {
      type: Number,
      enum: ProviderEnum,
      default: ProviderEnum.system,
    },

    bio: String,
    coverPhotos: String,
    DOB: Date,
    gender: {
      type: Number,
      enum: GenderEnum,
    },
    password: {
      type: String,
      required: function () {
        if (this.provider === ProviderEnum.google) return false;
        return true;
      },
    },
    profilePicture: String,
    role: {
      type: Number,
      enum: RoleEnum,
      default: RoleEnum.user,
    },
    isConfirmed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<UserDocument>("User", schema);
