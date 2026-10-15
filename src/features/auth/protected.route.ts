import { Router } from "express";
import logoutRoute from "./logout/route.js";

/**
 * Router auth untuk endpoint yang membutuhkan login.
 */
const authProtectedRoute = Router();

authProtectedRoute.use("/logout", logoutRoute);

export default authProtectedRoute;
