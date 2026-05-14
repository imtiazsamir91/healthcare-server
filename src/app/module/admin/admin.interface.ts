
import { Role, userStatus } from "../../../generated/prisma/enums";

export interface IUpdateAdminPayload {
    admin?: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
    }
}
export interface IChangeUserStatusPayload {
    userId : string;
    userStatus : userStatus;
}

export interface IChangeUserRolePayload {
    userId : string;
    role : Role;
}