import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import uploadFrame, { uploadFrameOptional } from "./upload-frame.middleware.js";
import createFrameController from "./controllers/create-frame.controller.js";
import readFramesController from "./controllers/read-frames.controller.js";
import updateFrameController from "./controllers/update-frame.controller.js";

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
framesRouter.put(
  "/:id",
  requireRole("cafe_admin", "super_admin"),
  uploadFrameOptional,
  updateFrameController,
);

export default framesRouter;
