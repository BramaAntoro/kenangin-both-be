import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import uploadFrame from "./upload-frame.middleware.js";
import createFrameController from "./controllers/create-frame.controller.js";
import readFramesController from "./controllers/read-frames.controller.js";

const framesRouter = Router();

framesRouter.post(
  "/",
  requireRole("cafe_admin", "super_admin"),
  uploadFrame,
  createFrameController,
);
framesRouter.get(
  "/",
  requireRole("cafe_admin", "super_admin"),
  readFramesController,
);

export default framesRouter;
