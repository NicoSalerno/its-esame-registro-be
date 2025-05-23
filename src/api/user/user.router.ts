import { Router } from "express";
import { me, printList } from "./user.controller";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { requireRole } from "../../lib/role-middleware";

const router = Router();
router.use(isAuthenticated);


router.get('/me', isAuthenticated, me );
router.get('/', requireRole('teacher', 'student'), printList);

export default router;