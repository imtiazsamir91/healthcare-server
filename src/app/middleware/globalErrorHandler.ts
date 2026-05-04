import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";

export const globalErrorhandler=(err: any, req: Request, res: Response,next: NextFunction) => {
 if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler details:", err);
  }
const statusCode: number = status.INTERNAL_SERVER_ERROR; // 500
const message: string = "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message
  });
}