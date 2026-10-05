import { Router } from "express";
import loginRoute from "./login/route.js";

const authRoute = Router();

authRoute.use("/login", loginRoute);

export default authRoute;
