import { register } from "../controllers/adminController";
import { Router } from "express";

const router = Router();

router.post("/register", register);

export default router;
