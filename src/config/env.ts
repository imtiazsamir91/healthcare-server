import dotenv from "dotenv";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";
dotenv.config();

interface EnvConfig {
    PORT: number;
    NODE_ENV: string;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVars = [
        "PORT",
        "NODE_ENV",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL"
    ];

   requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            // throw new Error(`Environment variable ${varName} is required but not defined.`);
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${varName} is required but not defined.`)
        }});

    return {
        PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
        NODE_ENV: process.env.NODE_ENV as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string
    };
}
export const envVars = loadEnvVariables();