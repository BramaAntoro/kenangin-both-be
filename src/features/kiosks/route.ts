import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createKioskController from "./controllers/create-kiosk.controller.js";
import deleteKioskController from "./controllers/delete-kiosk.controller.js";
import readKiosksController from "./controllers/read-kiosks.controller.js";
import updateKioskController from "./controllers/update-kiosk.controller.js";

const kiosksRoute = Router();

kiosksRoute.post("/", requireRole("super_admin"), createKioskController);
kiosksRoute.get(
  "/",
  requireRole("super_admin", "cafe_admin"),
  readKiosksController,
);
kiosksRoute.put("/:id", requireRole("super_admin"), updateKioskController);
kiosksRoute.delete("/:id", requireRole("super_admin"), deleteKioskController);

export default kiosksRoute;
