import { Router } from "express";
import requireRole from "../../middlewares/role.middleware.js";
import createCafeController from "./controllers/create-cafe.controller.js";
import readCafesController from "./controllers/read-cafes.controller.js";

const cafesRoute = Router();

cafesRoute.use(requireRole("super_admin"));

cafesRoute.post("/", createCafeController);
cafesRoute.get("/", readCafesController);

export default cafesRoute;
