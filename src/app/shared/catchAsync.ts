import { NextFunction, Request, Response, RequestHandler } from "express";

export const catchAsync = (fn: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "An error occurred",
                error: error.message || "Internal Server Error"
            });
        }
    }       
}