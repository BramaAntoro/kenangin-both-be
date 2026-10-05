import { Router } from "express";
import loginRoute from "./login/route.js";
import logoutRoute from "./logout/route.js";

const authRoute = Router();

authRoute.use("/login", loginRoute);
authRoute.use("/logout", logoutRoute);

export default authRoute;
