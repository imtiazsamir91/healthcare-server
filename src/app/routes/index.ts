import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoute } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../module/appointment/appointment.route";
// import { DoctorRoute } from "../module/doctor/doctor.route";
//import { SpecialtyRouter } from "../lib/module/specialty/specialty.route";


const router = Router();
router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialtyRouter);
router.use("/users", UserRoute);
router.use("/doctors", DoctorRoutes);
router.use("/admins", AdminRoutes)
router.use("/schedules", scheduleRoutes)
 router.use("/doctor-schedules", DoctorScheduleRoutes)
 router.use("/appointments", AppointmentRoutes)


export const indexRouter = router;