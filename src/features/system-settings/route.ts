import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createSystemSettingController from "./controllers/create-system-setting.controller.js";

const systemSettingsRoute = Router();

systemSettingsRoute.post(
  "/",
  requireRole("super_admin"),
  createSystemSettingController,
);

export default systemSettingsRoute;
