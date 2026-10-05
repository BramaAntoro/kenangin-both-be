import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createSystemSettingController from "./controllers/create-system-setting.controller.js";
import readSystemSettingsController from "./controllers/read-system-settings.controller.js";
import readDetailSystemSettingController from "./controllers/read-detail-system-setting.controller.js";
import updateSystemSettingController from "./controllers/update-system-setting.controller.js";

const systemSettingsRoute = Router();

systemSettingsRoute.use(requireRole("super_admin"));

systemSettingsRoute.post("/", createSystemSettingController);
systemSettingsRoute.get("/", readSystemSettingsController);
systemSettingsRoute.get("/:id", readDetailSystemSettingController);
systemSettingsRoute.put("/:id", updateSystemSettingController);

export default systemSettingsRoute;
