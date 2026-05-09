import status from "http-status";
import { Role, userStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import { IChangePasswordPayload } from "./auth.interface";

interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

const registerPatient = async (payload: RegisterPatientPayload) => {
    const { name, email, password } = payload;

   
    const authResponse = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
           
        }
    });

    if (!authResponse || !authResponse.user) {
        // throw new Error("User registration failed");
        throw new AppError(status.INTERNAL_SERVER_ERROR, "User registration failed");
    }

    try {
        
        const patientData = await prisma.$transaction(async (tx) => {
            const patientTx = await tx.patient.create({
                data: {
                    userId: authResponse.user.id,
                    email: payload.email,
                    name: payload.name,
                }
            });

            
            await tx.user.update({
                where: { id: authResponse.user.id },
                data: {
                    role: Role.PATIENT,
                    status: userStatus.ACTIVE
                }
            });
           

            return patientTx;
        });

          const accessToken = tokenUtils.getAccessToken({
        userId: authResponse.user.id,
        role: authResponse.user.role,
        name: authResponse.user.name,
        email: authResponse.user.email,
        status: authResponse.user.status,
        isDeleted: authResponse.user.isDeleted,
        emailVerified: authResponse.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: authResponse.user.id,
        role: authResponse.user.role,
        name: authResponse.user.name,
        email: authResponse.user.email,
        status: authResponse.user.status,
        isDeleted: authResponse.user.isDeleted,
        emailVerified: authResponse.user.emailVerified,
    });

        return { user: authResponse.user,
            patient: patientData, 
            accessToken,
            refreshToken,
            token: authResponse.token 
        };

    } catch (error: any) {
        
        console.error("Patient registration transaction failed:", error);
        await prisma.user.delete({ where: { id: authResponse.user.id } });
        throw new AppError(status.INTERNAL_SERVER_ERROR, error.message || "Failed to complete patient registration");
    }
}

interface ILoginPayload {
    email: string;
    password: string;
}

const loginUser = async (payload: ILoginPayload) => {
    const { email, password } = payload;

    const response = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    });

    if (!response || !response.user) {
        // throw new Error("Invalid email or password");
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
    }

   
    if (response.user.status === userStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "User is blocked. Please contact support.");
    }

    if (response.user.isDeleted) {
        throw new AppError(status.GONE, "User account has been deleted.");
    }
    const accessToken = tokenUtils.getAccessToken({
        userId: response.user.id,
        role: response.user.role,
        name: response.user.name,
        email: response.user.email,
        status: response.user.status,
        isDeleted: response.user.isDeleted,
        emailVerified: response.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: response
        
        .user.id,
        role: response.user.role,
        name: response.user.name,
        email: response.user.email,
        status: response.user.status,
        isDeleted: response.user.isDeleted,
        emailVerified: response.user.emailVerified,
    });

    return { ...response, accessToken, refreshToken };
}
const getMe = async (user : IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where : {
            id : user.userId,
        },
        include : {
            patient : {
                include : {
                    appointments : true,
                    reviews : true,
                    prescriptions : true,
                    medicalReports : true,
                    patientHealthData : true,
                }
            },
            doctor : {
                include : {
                    specialties : true,
                    appointments : true,
                    reviews : true,
                    prescriptions : true,
                }
            },
            admin : true,
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    return isUserExists;
}
const getNewToken = async (refreshToken : string, sessionToken : string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where : {
            token : sessionToken,
        },
        include : {
            user : true,
        }
    })

    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)


    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const {token} = await prisma.session.update({
        where : {
            token : sessionToken
        },
        data : {
            token : sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken : token,
    }

}
const changePassword = async (payload : IChangePasswordPayload, sessionToken : string) =>{
    const session = await auth.api.getSession({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(!session){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const {currentPassword, newPassword} = payload;

    const result = await auth.api.changePassword({
        body :{
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(session.user.needsPasswordReset){
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                needsPasswordReset: false,
            }
        })
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });
    

    return {
        ...result,
        accessToken,
        refreshToken,
    }
}

export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
}
