import { Role, User, userStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";

interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}


const registerPatient = async (payload: RegisterPatientPayload) => {
    const { name, email, password } = payload;

    const user = await auth.api.signUpEmail({
       body:{
         name,
        email,
        password
      
       }
    });

    if(!user){
        throw new Error("User registration failed");
    }
    return user;
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
        throw new Error("Invalid email or password");
    }

    
    if (response.user.status === userStatus.BLOCKED) {
        throw new Error("User is blocked");
    }

    if (response.user.isDeleted) {
        throw new Error("User account is deleted");
    }

    return response;
}

export const AuthService = {
    registerPatient,
    loginUser
}