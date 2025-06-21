import express from "express";
import { signup, login, checkAuth, logout } from "../controllers/auth";

const router = express.Router()

// ** Signup route
router.post(
    "/signup",
    express.json(),
    signup
);

// ** Login route
router.post(
    "/login",
    express.json(),
    login
);

// ** Check auth route
router.get(
    "/check",
    checkAuth
);

// ** logout route
router.post(
    "/logout",
    logout
);

export default router;
