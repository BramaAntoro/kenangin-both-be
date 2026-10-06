import { Router } from "express";
import createCafeAdminController from "./controllers/create-cafe-admin.controller.js";
import deleteCafeAdminController from "./controllers/delete-cafe-admin.controller.js";
import readCafeAdminController from "./controllers/read-cafe-admin.controller.js";
import updateCafeAdminController from "./controllers/update-cafe-admin.controller.js";

const createCafeAdminRoute = Router();

createCafeAdminRoute.post("/", createCafeAdminController);
createCafeAdminRoute.get("/", readCafeAdminController);
createCafeAdminRoute.put("/:id", updateCafeAdminController);
createCafeAdminRoute.delete("/:id", deleteCafeAdminController);

export default createCafeAdminRoute;
