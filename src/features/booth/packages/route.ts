import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import createBoothPackageController from "./controllers/create-booth-package.controller.js";
import deleteBoothPackageController from "./controllers/delete-booth-package.controller.js";
import readCafeBoothPackagesController from "./controllers/read-cafe-booth-packages.controller.js";
import readBoothPackageController from "./controllers/read-booth-package.controller.js";
import updateBoothPackageController from "./controllers/update-booth-package.controller.js";

const packagesRouter = Router();

packagesRouter.post(
  "/",
  requireRole("cafe_admin"),
  createBoothPackageController,
);
packagesRouter.get(
  "/",
  requireRole("super_admin", "cafe_admin"),
  readBoothPackageController,
);
packagesRouter.get(
  "/:cafeId",
  requireRole("super_admin", "cafe_admin"),
  readCafeBoothPackagesController,
);
packagesRouter.put(
  "/:id",
  requireRole("cafe_admin"),
  updateBoothPackageController,
);
packagesRouter.delete(
  "/:id",
  requireRole("cafe_admin"),
  deleteBoothPackageController,
);

export default packagesRouter;
