import { model, Schema, type HydratedDocument } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
  type IUser,
} from "../../modules/user/user.types";
import { decryption, encryption } from "../../utils/security/encryption";
import { createHash } from "../../utils/security/hash";

const userSchema = new Schema<IUser>(
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
      required: function (this: IUser) {
        this.provider == ProviderEnum.system ? true : false;
      },
    },
    phone: {
      type: String,
      set(value: string) {
        return encryption(value);
      },
      get(value: string) {
        return decryption(value);
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
      required: function (this: IUser) {
        this.provider == ProviderEnum.system ? true : false;
      },
      //unique : true
    },
    confirmedAt: Date,
    blockedAt: Date,
    // otp: otpSchema
    deletedAt: Date,
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
        delete (ret as IUser & { id?: string }).id;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform(doc, ret) {
        delete (ret as IUser & { id?: string }).id;
        return ret;
      },
    },
    virtuals: {
      fullName: {
        get(this: IUser) {
          return this.firstName + " " + this.lastName;
        },
        set(this: HydratedDocument<IUser>, value: string) {
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

userSchema.pre(["find","findOne","findOneAndDelete","findOneAndUpdate"], function () {
  this.setQuery({
    ...this.getQuery(),
    deletedAt: {
      $exists: false,
    },
  });
 
})

userSchema.pre("save",async function () {
  if (this.isNew || this.isModified("password")) {
    if (this.password) {
      this.password = await createHash(this.password)
    }
  }
 
})

export const userModel = model<IUser>("user", userSchema);
