import { Router } from "express";
import { createClassroom, getClassrooms, seeAssigmentOfClass, setAssigmentToClass, setTrue } from "./classroom.controller";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { requireRole } from "../../lib/role-middleware";

const router = Router();
router.use(isAuthenticated);

router.post('/classrooms',requireRole('teacher') ,createClassroom);
router.get('/classrooms',requireRole('teacher', 'student') ,getClassrooms);
router.post('/classrooms/:classroomId/assigments',requireRole('teacher') ,setAssigmentToClass);
router.get('/classrooms/:classroomId/assigments',requireRole('teacher', 'student') ,seeAssigmentOfClass);
router.patch('/classrooms/:classroomId/assignments/:id',requireRole('student'), setTrue);
export default router;

