import { userModel } from "../../DB/models/user.model.js";
import type { signUpData } from "./user.validation.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import { emailTemplate } from "../../utils/email/emailTemplate.js";
import { createHash } from "../../utils/security/hash.js";
import { redisClient } from "../../DB/redis.connection.js";
import {
  attemptsKay,
  confirmEmailKay,
  resendOtpKay,
} from "../../utils/redis.services.js";
import { random } from "../../utils/email/createOTP.js";
import {
  AppError,
  badRequestException,
  notFoundException,
} from "../../utils/error.handle.js";

export const signUp = async (data: signUpData) => {
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
    password: await createHash(data.password),
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
};
