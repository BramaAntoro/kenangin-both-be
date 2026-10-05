import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createSystemSettingController from "./controllers/create-system-setting.controller.js";
import readSystemSettingsController from "./controllers/read-system-settings.controller.js";

const systemSettingsRoute = Router();

systemSettingsRoute.get(
  "/",
  requireRole("super_admin"),
  readSystemSettingsController,
);

systemSettingsRoute.post(
  "/",
  requireRole("super_admin"),
  createSystemSettingController,
);

export default systemSettingsRoute;
