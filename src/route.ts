import { Router } from "express";
import publicRoute from "./routes/public.route.js";
import protectedRoute from "./routes/protected.route.js";

const apiRoute = Router();

apiRoute.get("/", (_request, response) => {
  response.json({ message: "Server Express + TypeScript (ESM) berjalan!" });
});

apiRoute.use(publicRoute);
apiRoute.use(protectedRoute);

export default apiRoute;
