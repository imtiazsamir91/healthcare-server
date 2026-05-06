import status from "http-status";
import { Role, userStatus } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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

        return { user: authResponse.user, patient: patientData };

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

    return response;
}

export const AuthService = {
    registerPatient,
    loginUser
}