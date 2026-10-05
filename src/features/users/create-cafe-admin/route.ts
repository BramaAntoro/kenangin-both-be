import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import createCafeAdminController from "./controllers/create-cafe-admin.controller.js";

const createCafeAdminRoute = Router();

createCafeAdminRoute.post(
  "/",
  requireRole("super_admin"),
  createCafeAdminController,
);

export default createCafeAdminRoute;
