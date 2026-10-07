import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import createBoothPackageController from "./controllers/create-booth-package.controller.js";
import readBoothPackageController from "./controllers/read-booth-package.controller.js";

const packagesRouter = Router()

packagesRouter.post(
  "/",
  requireRole("cafe_admin"),
  createBoothPackageController,
);
packagesRouter.get("/", requireRole("super_admin", "cafe_admin"), readBoothPackageController)

export default packagesRouter