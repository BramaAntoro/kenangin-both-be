import { Router } from "express";
import packagesRouter from "./packages/route.js";

const boothRoute = Router();

boothRoute.use("/packages", packagesRouter);

export default boothRoute;

