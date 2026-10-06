import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createCafeController from "./controllers/create-cafe.controller.js";
import readCafesController from "./controllers/read-cafes.controller.js";
import updateCafeController from "./controllers/update-cafe.controller.js";

const cafesRoute = Router();

cafesRoute.use(requireRole("super_admin"));

cafesRoute.post("/", createCafeController);
cafesRoute.get("/", readCafesController);
cafesRoute.put("/:id", updateCafeController);

export default cafesRoute;
