import { Router } from "express";
import userRouter from "./user/user.router";
import authRouter from "./auth/auth.router";
import classroomRouter from "./classroom/classroom.router"

const router = Router();

router.use('/users', userRouter);
router.use('/', authRouter);
router.use('/', classroomRouter);

export default router;