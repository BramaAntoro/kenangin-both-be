import { Router } from "express";
import guestMiddleware from "../../../middlewares/guest.middleware.js";
import registerController from "./controller.js";

const registerRoute = Router();

registerRoute.post("/", guestMiddleware, registerController);

export default registerRoute;
