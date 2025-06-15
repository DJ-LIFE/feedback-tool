import { login, register } from "../controllers/adminController";
import { Router} from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
