import nodemailer from "nodemailer"
import { PASSWORD, USER } from "../../config/config.js";





export const sendEmail = async ({to, subject, html}:{to:string, subject:string, html:string})=>{
    const transporter = nodemailer.createTransport({
        auth:{
            user: USER,
            pass: PASSWORD
        },
        service: "gmail"
    })
    

    const info = await transporter.sendMail({
        from:"Social App <SocialApp@gmail.com>",
        to,
        subject,
        html
    })
    console.log(info.accepted);
    
}