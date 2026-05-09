import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma/enums";
import { bearer } from "better-auth/plugins";
//import { Role } from '@prisma/client';

// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },

    user:{
        additionalFields:{
            role:{
                type:"string",
                required:true,
                defaultValue:Role.PATIENT
            },
            status:{
                type:"string",
                required:true,
                defaultValue:"ACTIVE"
            },
            needsPasswordReset:{

                type:"boolean",
                required:true,
                defaultValue:true
            },
            isDeleted:{
                type:"boolean",
                required:true,
                defaultValue:false
            },
            deletedAt:{
                type:"date",
                required:false,
                defaultValue:null
            }
        }
    },
    trustedOrigins: ["http://localhost:5173", "http://localhost:5000"],
    advanced:{
        disableCSRFCheck: true
    },

plugins: [
        bearer(),
        // emailOTP({
        //     overrideDefaultEmailVerification: true,
        //     async sendVerificationOTP({email, otp, type}) {
        //         if(type === "email-verification"){
        //           const user = await prisma.user.findUnique({
        //             where : {
        //                 email,
        //             }
        //           })

        //            if(!user){
        //             console.error(`User with email ${email} not found. Cannot send verification OTP.`);
        //             return;
        //            }

        //            if(user && user.role === Role.SUPER_ADMIN){
        //             console.log(`User with email ${email} is a super admin. Skipping sending verification OTP.`);
        //             return;
        //            }
                  
        //             if (user && !user.emailVerified){
        //             sendEmail({
        //                 to : email,
        //                 subject : "Verify your email",
        //                 templateName : "otp",
        //                 templateData :{
        //                     name : user.name,
        //                     otp,
        //                 }
        //             })
        //           }
        //         }else if(type === "forget-password"){
        //             const user = await prisma.user.findUnique({
        //                 where : {
        //                     email,
        //                 }
        //             })

        //             if(user){
        //                 sendEmail({
        //                     to : email,
        //                     subject : "Password Reset OTP",
        //                     templateName : "otp",
        //                     templateData :{
        //                         name : user.name,
        //                         otp,
        //                     }
        //                 })
        //             }
        //         }
        //     },
        //     expiresIn : 2 * 60, // 2 minutes in seconds
        //     otpLength : 6,
        // })
    ],

    session: {
        expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
        updateAge: 60 * 60 * 60 * 24, // 1 day in seconds
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
        }
    },
});