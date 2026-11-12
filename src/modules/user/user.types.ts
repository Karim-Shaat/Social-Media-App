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

export interface iUser {
  firstName: String;
  lastName: String;
  email: String;
  password?: String;
  phone?: String | undefined;
  age?: Number | undefined;
  profileImage: String;
  gender: GenderEnum;
  provider: ProviderEnum;
  role: RoleEnum;
  bio?: String | undefined;
  userName?: String;
  confirmedAt: Date;
  blockedAt: Date;
  fullName:String
}
