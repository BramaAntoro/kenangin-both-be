import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import readBoothPackageCafeController from "./controllers/read-booth-package-cafe.controller.js";
import createCafeController from "./controllers/create-cafe.controller.js";
import deleteCafeController from "./controllers/delete-cafe.controller.js";
import readCafesController from "./controllers/read-cafes.controller.js";
import updateCafeController from "./controllers/update-cafe.controller.js";
import { readCafeKiosksController } from "../kiosks/controllers/read-kiosks.controller.js";

const cafesRoute = Router();

cafesRoute.post("/", requireRole("super_admin"), createCafeController);
cafesRoute.get("/", requireRole("super_admin"), readCafesController);
cafesRoute.get(
  "/packages/:cafeId",
  requireRole("super_admin", "cafe_admin"),
  readBoothPackageCafeController,
);
cafesRoute.get(
  "/kiosks/:cafeId",
  requireRole("super_admin", "cafe_admin"),
  readCafeKiosksController,
);
cafesRoute.put("/:id", requireRole("super_admin"), updateCafeController);
cafesRoute.delete("/:id", requireRole("super_admin"), deleteCafeController);

export default cafesRoute;
