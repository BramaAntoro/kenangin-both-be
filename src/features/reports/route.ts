import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import readRevenueRecapController from "./controllers/read-revenue-recap.controller.js";
import readCafeRevenueController from "./controllers/read-cafe-revenue.controller.js";

const reportsRoute = Router();

reportsRoute.use(requireRole("super_admin"));

reportsRoute.get("/revenue-recap", readRevenueRecapController);
reportsRoute.get("/revenue-recap/cafe", readCafeRevenueController);

export default reportsRoute;
