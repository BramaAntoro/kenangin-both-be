import { Router } from "express";
import guestMiddleware from "../../../middlewares/guest.middleware.js";
import loginController from "./controllers/login.controller.js";

const loginRoute = Router();

loginRoute.post("/", guestMiddleware, loginController);

export default loginRoute;
