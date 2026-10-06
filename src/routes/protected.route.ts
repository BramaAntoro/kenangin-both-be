import { Router } from "express";
import authProtectedRoute from "../features/auth/protected.route.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import usersProtectedRoute from "../features/users/users.route.js";
import systemSettingsRoute from "../features/system-settings/route.js";
import cafesRoute from "../features/cafes/route.js";

/**
 * Router untuk endpoint yang membutuhkan autentikasi.
 *
 * Semua route yang dipasang pada router ini otomatis melewati
 * `authMiddleware`.
 */
const protectedRoute = Router();

protectedRoute.use(authMiddleware);
protectedRoute.use("/auth", authProtectedRoute);
protectedRoute.use("/users", usersProtectedRoute);
protectedRoute.use("/system-settings", systemSettingsRoute);
protectedRoute.use("/cafes", cafesRoute);

export default protectedRoute;
