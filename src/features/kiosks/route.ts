import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createKioskController from "./controllers/create-kiosk.controller.js";

const kiosksRoute = Router();

kiosksRoute.use(requireRole("super_admin"));

kiosksRoute.post("/", createKioskController);

export default kiosksRoute;
