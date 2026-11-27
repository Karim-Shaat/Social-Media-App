import type { logInData, signUpData } from "./user.validation";
import { sendEmail } from "../../utils/email/sendEmail";
import { emailTemplate } from "../../utils/email/emailTemplate";
import { compareHash, createHash } from "../../utils/security/hash";
import { redisClient } from "../../DB/redis.connection";
import {
  attemptsKay,
  confirmEmailKay,
  resendOtpKay,
  userSessionJwtIdKay,
} from "../../utils/redis.services";
import { random } from "../../utils/email/createOTP";
import {
  AppError,
  badRequestException,
  notFoundException,
} from "../../utils/error.handle";
import { UserRepo } from "../../DB/repo/user.repo";
import { userModel } from "../../DB/models/user.model";
import jwt from "jsonwebtoken";
import { ProviderEnum, type HUser } from "./user.types";
import { nanoid } from "nanoid";
import { AccessToken, RefreshToken } from "../../config/config";
import s3Service from "../../utils/aws/s3.services";



class UserService {
  private userRepo = new UserRepo();

  constructor() {
    // this.signUpService = this.signUpService.bind(this);
  }
  async signUpService(data: signUpData) {
    const isExist = await userModel.findOne({
      $or: [{ email: data.email }, { userName: data.userName }],
    });
    if (isExist) {
      throw new badRequestException(
        `${isExist.email == data.email ? "Email" : "UserName"} Already Exist`,
      );
    }

    const otp = random(6);
    await sendEmail({
      to: data.email,
      subject: "confirm email",
      html: emailTemplate({
        otp,
        subject: "confirm email",
      }),
    });

    const user = await userModel.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      gender: data.gender,
      phone: data.phone,
      bio: data.bio,
      age: data.age,
      userName: data.userName,
    });

    const redisKay = confirmEmailKay(user._id);
    await redisClient.set(redisKay, await createHash(otp), {
      expiration: {
        type: "EX",
        value: 5 * 60,
      },
    });
    await redisClient.set(resendOtpKay(user._id), 0, {
      expiration: {
        type: "EX",
        value: 1 * 60,
      },
    });
    await redisClient.incr(attemptsKay(user._id));

    return {
      data: {
        user,
      },
    };
  }

  async loginService ({identifier, password}:logInData){
    const user = await this.userRepo.findOne({
        $or:[
            {email : identifier},
            {userName : identifier},
        ]
    })
    if (!user) {
      throw new badRequestException("invalid credentials")
    }
    if (user.provider > ProviderEnum.system || !user.password) {
      throw new badRequestException("use your provider");
    }
    const isPasswordMatch = await compareHash(password, user.password as string) 
    if (!isPasswordMatch) {
        throw new badRequestException("invalid credentials")
    }
    const jwtid = nanoid()
    const accessToken = jwt.sign({
        _id: user._id,
        email: user.email,
    },AccessToken,{
        expiresIn:"60S",
        jwtid
    })
    const refreshToken = jwt.sign({
        _id: user._id,
        email: user.email,
    },RefreshToken,{
        expiresIn: "7d",
        jwtid
    })
    await redisClient.set(userSessionJwtIdKay(user._id,jwtid), jwtid,{
        expiration:{
            type:"EX",
            value: 7 * 24 * 60 * 60
        }
    } )

    return{
        data:{
            accessToken,
            refreshToken
        }
    }
}

  async updateProfileImageService({ user, file }: { user: HUser; file: Express.Multer.File}) {

    const path = await s3Service.uploadFile({
      Path: `${user._id}/profile-image`,
      file,
    });
    user.profileImage = path;
    await user.save();

    return {
      data: {
        profileImage: user.profileImage,
      },
    };
  }


}

export const UserServices = new UserService();
