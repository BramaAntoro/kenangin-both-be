import { Router } from "express";
import createCafeAdminRoute from "./cafe-admin/route.js";

/**
 * Router user untuk endpoint yang membutuhkan autentikasi.
 */
const usersProtectedRoute = Router();

usersProtectedRoute.use("/cafe-admin", createCafeAdminRoute);

export default usersProtectedRoute;
