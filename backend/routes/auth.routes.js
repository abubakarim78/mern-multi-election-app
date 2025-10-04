import express from "express";
import { signup, login, logout, verifyOtp } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);

export default router;