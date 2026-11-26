import { HydratedDocument } from "mongoose";

export enum GenderEnum {
  male,
  female,
}
export enum ProviderEnum {
  system,
  google,
}
export enum RoleEnum {
  user,
  admin,
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string | undefined;
  age?: Number | undefined;
  profileImage: string;
  gender: GenderEnum;
  provider: ProviderEnum;
  role: RoleEnum;
  bio?: string | undefined;
  userName?: string;
  confirmedAt: Date;
  blockedAt: Date;
  deletedAt: Date,
  fullName:string
}

export type HUser = HydratedDocument<IUser>