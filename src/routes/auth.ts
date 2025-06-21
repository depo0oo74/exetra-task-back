import express from "express";
import { signup, login } from "../controllers/auth";

const router = express.Router()

// ** Signup route
router.post(
    "/signup",
    express.json(),
    signup
);

// ** Signup route
router.post(
    "/login",
    express.json(),
    login
);

export default router;
