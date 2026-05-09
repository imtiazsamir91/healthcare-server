import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoute } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
// import { DoctorRoute } from "../module/doctor/doctor.route";
//import { SpecialtyRouter } from "../lib/module/specialty/specialty.route";


const router = Router();
router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialtyRouter);
router.use("/users", UserRoute);
router.use("/doctors", DoctorRoutes);


export const indexRouter = router;