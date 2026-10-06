import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import createCafeAdminController from "./controllers/create-cafe-admin.controller.js";
import readCafeAdminController from "./controllers/read-cafe-admin.controller.js";

const createCafeAdminRoute = Router();

createCafeAdminRoute.post("/", createCafeAdminController);
createCafeAdminRoute.get("/", readCafeAdminController);

export default createCafeAdminRoute;
