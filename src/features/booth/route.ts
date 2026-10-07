import { Router } from "express";
import packagesRouter from "./packages/route.js";

const boothRoute = Router();

boothRoute.use("/", packagesRouter);

export default boothRoute;

