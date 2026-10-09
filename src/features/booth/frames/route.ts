import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import uploadFrame from "./upload-frame.middleware.js";
import createFrameController from "./controllers/create-frame.controller.js";

const framesRouter = Router();

framesRouter.post(
  "/",
  requireRole("cafe_admin", "super_admin"),
  uploadFrame,
  createFrameController,
);

export default framesRouter;
