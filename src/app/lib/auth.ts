import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../../generated/prisma/enums";
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
    session: {
        expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
        updateAge: 60 * 60 * 60 * 24, // 1 day in seconds
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
        }
    },
});