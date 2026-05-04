//import { catchAsync } from "../../../shared/catchAsync";
//import { sendResponse } from "../../../shared/sendresponse";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendresponse";
import { SpecialtyService } from "./specialty.service";
import { NextFunction, Request, RequestHandler, Response } from "express";




const createSpecialty = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await SpecialtyService.createSpecialty(payload);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        data: result,
        message: "Specialty created successfully"
    });
});

const getAllSpecialty = catchAsync(async (req:Request, res: Response) => {
    const result = await SpecialtyService.getAllSpecialty();
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,       
        data: result,
        message: "Specialties retrieved successfully"
    });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtyService.deleteSpecialty(id as string);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        data: result,
        message: "Specialty deleted successfully"
    });
});
      

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty
}