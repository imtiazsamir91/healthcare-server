import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoute } from "../module/user/user.route";
//import { SpecialtyRouter } from "../lib/module/specialty/specialty.route";


const router = Router();
router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialtyRouter);
router.use("/users", UserRoute);


export const indexRouter = router;