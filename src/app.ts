import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
//import { SpecialtyRouter } from "./app/lib/module/specialty/specialty.route";
import { indexRouter } from "./app/routes";

import { notFound } from "./app/middleware/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";

const app:Application = express();

app.use (express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
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