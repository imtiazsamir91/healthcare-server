import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
//import { SpecialtyRouter } from "../lib/module/specialty/specialty.route";


const router = Router();
router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialtyRouter);


export const indexRouter = router;