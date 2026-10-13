import { Router } from "express";
import packagesRouter from "./packages/route.js";
import framesRouter from "./frames/route.js";
import transactionRouter from "../transactions/route.js";

const boothRoute = Router();

boothRoute.use("/packages", packagesRouter);
boothRoute.use("/frames", framesRouter);
boothRoute.use("/transaction", transactionRouter)

export default boothRoute;
