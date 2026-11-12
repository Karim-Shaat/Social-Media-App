import z from "zod";
import { GenderEnum } from "./user.types.js";

export const signUpSchema = {
  body: z
    .strictObject({
      fullName: z.string(),
      email: z.email(),
      phone: z.string().min(10).max(14),
      password: z.string(),
      confirmPassword: z.string(),
      age: z.number().optional(),
      gender: z.enum(GenderEnum),
      userName: z.string(),
      bio: z.string().optional(),
    })
    .refine((arg) => arg.password == arg.confirmPassword, {
      error: "password mismatch",
      path: ["password", "confirmPassword"],
    }),
};

export type signUpData = z.infer<typeof signUpSchema.body>;
