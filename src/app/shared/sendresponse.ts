import { Response } from "express";

interface IResponseData<T> {
    httpStatusCode: number;
    success: boolean;
    data: T;
    message?: string;
   
}

export const sendResponse = <T>(res: Response, responseData: IResponseData<T>): void => {
    const { httpStatusCode, success, data, message } = responseData;
    res.status(httpStatusCode).json({
        success,
        data,
        message
    });
}