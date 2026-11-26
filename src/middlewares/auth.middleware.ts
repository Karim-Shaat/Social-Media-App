import jwt from "jsonwebtoken";
import { userSessionJwtIdKay } from "../utils/redis.services";
import { redisClient } from "../DB/redis.connection";
import { badRequestException, notFoundException, unAuthorizedException } from "../utils/error.handle";
import { userModel } from "../DB/models/user.model";
import { AccessToken, RefreshToken } from "../config/config";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { IRequest } from "../utils/types";
import { HUser } from "../modules/user/user.types";


export enum TokenEnum{
    access,
    refresh
}

declare module "express-serve-static-core"{
    interface Request{
        jti ?: string,
        user ?: HUser
    }
}

export const decodeToken = async ({authorization, tokenType = TokenEnum.access}:{authorization?: string | undefined, tokenType?: TokenEnum})=>{
     

    if (!authorization || !authorization.startsWith("Bearer")) {
        throw new unAuthorizedException();        
    }

    const token = authorization.split(" ")[1]
    if (!token) {
        throw new unAuthorizedException();
    }
    const payload = jwt.verify(token,
        tokenType == TokenEnum.access ? AccessToken: RefreshToken  
    ) as jwt.JwtPayload & {email:string ,_id:Types.ObjectId}
    
    const user = await userModel.findById(payload._id)
    if(!user){
        throw new notFoundException();        
    }
    if(!user.confirmedAt){
       throw new unAuthorizedException("confirm your account");
    }
    const { jti } = payload
    if(!jti){
        throw new badRequestException("in-valid token");
    }
    const redisJti = await redisClient.get(userSessionJwtIdKay(user._id, jti))
    if(!redisJti){
        throw new badRequestException("logged out login again");
    }

    return {
        user,
        jti
    }
}

export const auth = async(req:Request, res: Response, next: NextFunction)=>{
    const {authorization} = req.headers
    const { jti, user } = await decodeToken({authorization})
    req.user = user
    req.jti = jti
    next()
}
