import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import transactionInitiateController from "./initiate/controllers/transaction-initiate.controller.js";

const transactionRouter = Router();

transactionRouter.post("/initiate", requireRole("cafe_admin"), transactionInitiateController)

export default transactionRouter