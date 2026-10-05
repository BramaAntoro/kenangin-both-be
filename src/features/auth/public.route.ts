import { Router } from "express";
import loginRoute from "./login/route.js";

/**
 * Router auth untuk endpoint yang dapat diakses tanpa login.
 */
const authPublicRoute = Router();

authPublicRoute.use("/login", loginRoute);

export default authPublicRoute;
