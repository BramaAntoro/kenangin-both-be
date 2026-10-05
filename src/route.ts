import { Router } from "express";
import authRoute from "./features/auth/route.js";

const apiRoute = Router();

apiRoute.get("/", (_request, response) => {
  response.json({ message: "Server Express + TypeScript (ESM) berjalan!" });
});

apiRoute.use("/auth", authRoute);

export default apiRoute;
