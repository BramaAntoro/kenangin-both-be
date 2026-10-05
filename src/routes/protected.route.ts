import { Router } from "express";
import authProtectedRoute from "../features/auth/protected.route.js";
import authMiddleware from "../middlewares/auth.middleware.js";

/**
 * Router untuk endpoint yang membutuhkan autentikasi.
 *
 * Semua route yang dipasang pada router ini otomatis melewati
 * `authMiddleware`.
 */
const protectedRoute = Router();

protectedRoute.use(authMiddleware);
protectedRoute.use("/auth", authProtectedRoute);

export default protectedRoute;
