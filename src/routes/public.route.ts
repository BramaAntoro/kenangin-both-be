import { Router } from "express";
import authPublicRoute from "../features/auth/public.route.js";

/**
 * Router untuk endpoint yang dapat diakses tanpa autentikasi.
 */
const publicRoute = Router();

publicRoute.use("/auth", authPublicRoute);

export default publicRoute;
