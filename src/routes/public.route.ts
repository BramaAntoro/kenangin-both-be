import { Router } from "express";
import authPublicRoute from "../features/auth/public.route.js";
import webhookController from "../features/transactions/webhook/controllers/webhook.controllert.js";

/**
 * Router untuk endpoint yang dapat diakses tanpa autentikasi.
 */
const publicRoute = Router();

publicRoute.use("/auth", authPublicRoute);
publicRoute.post("/booth/transaction/webhook", webhookController);

export default publicRoute;
