import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import readRevenueRecapController from "./controllers/read-revenue-recap.controller.js";
import readCafeRevenueController from "./controllers/read-cafe-revenue.controller.js";
import readCafeAdminRevenueController from "./controllers/read-cafe-admin-revenue.controller.js";
import readCafeAdminCafesController from "./controllers/read-cafe-admin-cafes.controller.js";

const reportsRoute = Router();

reportsRoute.get("/revenue-recap/mine", requireRole("cafe_admin"), readCafeAdminRevenueController);
reportsRoute.get("/revenue-recap/mine/cafes", requireRole("cafe_admin"), readCafeAdminCafesController);
reportsRoute.get("/revenue-recap", requireRole("super_admin"), readRevenueRecapController);
reportsRoute.get("/revenue-recap/cafe", requireRole("super_admin"), readCafeRevenueController);

export default reportsRoute;
