import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
//import { SpecialtyRouter } from "./app/lib/module/specialty/specialty.route";
import { indexRouter } from "./app/routes";

import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path/win32";
import { envVars } from "./app/config/env";
import cors from "cors";
import qs from "qs";

const app:Application = express();
app.set("query parser", (str : string) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views",path.resolve(process.cwd(), `src/app/templates`) )

//app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)


app.use(cors({
    origin : [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders : ["Content-Type", "Authorization"]
}))
app.use("/api/auth", toNodeHandler(auth))

app.use(express.urlencoded({ extended: true }));




app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', indexRouter);

app.get('/', async (req: Request, res: Response) => {

  const speciality = await prisma.speciality.create({
    data: {
      title: "Cardiology"
    }
  });
  res.status(200).json({
    success:true,
    message:"Welcome to PH Healthcare API",
    data: speciality
  });
});

app.use(globalErrorHandler);
app.use(notFound)

export default app;