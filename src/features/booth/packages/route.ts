import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import createBoothPackageController from "./controllers/create-booth-package.controller.js";

const packagesRouter = Router()

packagesRouter.post(
  "/packages",
  requireRole("cafe_admin"),
  createBoothPackageController,
);

export default packagesRouter