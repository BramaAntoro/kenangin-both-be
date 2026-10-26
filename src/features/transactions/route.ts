import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import transactionInitiateController from "./initiate/controllers/transaction-initiate.controller.js";
import readTransactionStatusController from "./status/read-transaction-status.controller.js";

const transactionRouter = Router();

transactionRouter.post("/initiate", requireRole("cafe_admin"), transactionInitiateController);
transactionRouter.get(
  "/:orderId",
  requireRole("cafe_admin"),
  readTransactionStatusController,
);

export default transactionRouter;