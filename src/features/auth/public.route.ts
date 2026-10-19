import { Router } from "express";
import loginRoute from "./login/route.js";
import registerRoute from "./register/route.js";

/**
 * Router auth untuk endpoint yang dapat diakses tanpa login.
 */
const authPublicRoute = Router();

authPublicRoute.use("/login", loginRoute);
authPublicRoute.use("/register", registerRoute);

export default authPublicRoute;
