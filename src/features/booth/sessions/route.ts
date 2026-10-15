import { Router } from "express";
import uploadPhoto from "./upload-photo.middleware.js";
import updateSessionController from "./controllers/update-session.controller.js";

const sessionsRouter = Router();

sessionsRouter.patch("/:sessionCode", uploadPhoto, updateSessionController);

export default sessionsRouter;
