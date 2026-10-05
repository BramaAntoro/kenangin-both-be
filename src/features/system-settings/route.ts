import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createSystemSettingController from "./controllers/create-system-setting.controller.js";
import readSystemSettingsController from "./controllers/read-system-settings.controller.js";

const systemSettingsRoute = Router();


systemSettingsRoute.use(requireRole("super_admin"))

systemSettingsRoute.get(
  "/",
  readSystemSettingsController,
);

systemSettingsRoute.post(
  "/",
  createSystemSettingController,
);



export default systemSettingsRoute;
