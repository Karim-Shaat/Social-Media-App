import type { Types } from "mongoose"

export const userPrefixKay = (userId:string | Types.ObjectId) => `users:${userId}:otp`

export const confirmEmailKay = (userId:string | Types.ObjectId) => `${userPrefixKay(userId)}:confirmEmail`
export const resendOtpKay = (userId:string | Types.ObjectId) => `${userPrefixKay(userId)}:resend`
export const attemptsKay = (userId:string | Types.ObjectId) => `${userPrefixKay(userId)}:attempts`
export const attemptBlockKay = (userId:string | Types.ObjectId) => `${userPrefixKay(userId)}:block`
export const attemptBlockCountKay = (userId:string | Types.ObjectId) => `${userPrefixKay(userId)}:blockCount`




export const userSessionJwtIdPrefixKay = (userId:string | Types.ObjectId) => `users:${userId}:session`

export const userSessionJwtIdKay = (userId:string | Types.ObjectId, jwtid:string) => `${userSessionJwtIdPrefixKay(userId)}:${jwtid}`
