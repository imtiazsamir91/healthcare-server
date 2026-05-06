

import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middleware/validateRequest";



const router = Router();

router.get("/", DoctorController.getAllDoctors);

export const DoctorRoute = router;