import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { sendResponse } from "../../shared/sendresponse";


const registerPatient = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const user = await AuthService.registerPatient(payload);
    const { accessToken, refreshToken, token, ...rest } = user;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Patient registered successfully",
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest,
        }
    });


    });


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const user = await AuthService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = user;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest,
        }
    });
});

export const AuthController = {
    registerPatient,
    loginUser
}