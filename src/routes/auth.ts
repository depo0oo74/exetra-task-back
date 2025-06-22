import express from "express";
import { signup, login, checkAuth, logout, forgotPassword, resetPassword } from "../controllers/auth";

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

// ** forgot password route
router.post(
    "/forgot-password",
    express.json(),
    forgotPassword
);

// ** reset password route
router.post(
    "/reset-password/:token",
    express.json(),
    resetPassword
);

export default router;
