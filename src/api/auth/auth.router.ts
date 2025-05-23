import { Router } from "express";
import { AddUserDTO } from "./auth.dto";
import { validate } from "../../lib/validation-middleware";
import { addUser, login } from "./auth.controller";
const router = Router();

router.post('/login', login);  
router.post('/register', validate(AddUserDTO, 'body'), addUser);
export default router;
