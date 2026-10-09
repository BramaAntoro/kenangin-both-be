import { Router } from "express";
import packagesRouter from "./packages/route.js";
import framesRouter from "./frames/route.js";

const boothRoute = Router();

boothRoute.use("/packages", packagesRouter);
boothRoute.use("/frames", framesRouter);

export default boothRoute;
