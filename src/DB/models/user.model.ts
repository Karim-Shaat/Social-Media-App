import { model, Schema, type HydratedDocument } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
  type iUser,
} from "../../modules/user/user.types.js";
import { decryption, encryption } from "../../utils/security/encryption.js";

const userSchema = new Schema<iUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function (this: iUser) {
        this.provider == ProviderEnum.system ? true : false;
      },
    },
    phone: {
      type: String,
      set(value: string) {
        return encryption(value)
      },
      get(value: string) {
        return decryption(value)
      },
    },
    age: Number,
    profileImage: {
      type: String,
    },
    gender: {
      type: Number,
      enum: GenderEnum,
    },
    provider: {
      type: Number,
      enum: ProviderEnum,
      default: ProviderEnum.system,
    },
    role: {
      type: Number,
      enum: RoleEnum,
      default: RoleEnum.user,
    },
    bio: String,
    userName: {
      type: String,
      required: function (this: iUser) {
        this.provider == ProviderEnum.system ? true : false;
      },
      //unique : true
    },
    confirmedAt: Date,
    blockedAt: Date,
    // otp: otpSchema
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    optimisticConcurrency: true,
    toJSON: {
      virtuals: true,
      getters: true,
      transform(doc, ret) {
        delete (ret as iUser & { id?: string }).id;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform(doc, ret) {
        delete (ret as iUser & { id?: string }).id;
        return ret;
      },
    },
    virtuals: {
      fullName: {
        get(this: iUser) {
          return this.firstName + " " + this.lastName;
        },
        set(this: HydratedDocument<iUser>, value: string) {
          const [firstName, lastName] = value.split(" ");
          if (!firstName || !lastName) {
            throw new Error("in valid fullname");
          }
          (this.set("firstName", firstName), this.set("lastName", lastName));
        },
      },
    },
  },
);

export const userModel = model("user", userSchema);
