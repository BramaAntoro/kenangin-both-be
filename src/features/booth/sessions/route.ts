import { Router } from "express";
import requireRole from "../../../middlewares/role.middleware.js";
import deleteSessionController from "./controllers/delete-session.controller.js";
import uploadPhoto from "./upload-photo.middleware.js";
import updateSessionController from "./controllers/update-session.controller.js";

const sessionsRouter = Router();

sessionsRouter.patch("/:sessionCode", uploadPhoto, updateSessionController);
sessionsRouter.delete(
  "/:sessionCode",
  requireRole("super_admin"),
  deleteSessionController,
);

export default sessionsRouter;
