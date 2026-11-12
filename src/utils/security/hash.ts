import { compare, hash } from "bcrypt";

export const createHash = async (password:string)=>{
    const generateHash = await hash(password, 10)
    return generateHash 
} 

export const compareHash = async (password:string, hashedPassword:string)=>{
    const isMatch = await compare(password, hashedPassword)
    return isMatch
} 