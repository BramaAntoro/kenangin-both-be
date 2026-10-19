import { Router } from "express";
import logoutRoute from "./logout/route.js";
import readCurrentUserController from "./read-current-user.controller.js";

/**
 * Router auth untuk endpoint yang membutuhkan login.
 */
const authProtectedRoute = Router();

authProtectedRoute.get("/me", readCurrentUserController);
authProtectedRoute.use("/logout", logoutRoute);

export default authProtectedRoute;
