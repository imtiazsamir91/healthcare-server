import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import status from "http-status";


const registerPatient = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const user = await AuthService.registerPatient(payload);

    res.status(201).json({
       httpStatusCode: status.CREATED,
       success: true,
       message: "Patient registered successfully",
       data: user

    });
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const user = await AuthService.loginUser(payload);

    res.status(200).json({
        httpStatusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: user
    });
});

export const AuthController = {
    registerPatient,
    loginUser
}