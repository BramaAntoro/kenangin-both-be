import express from "express";
import { HOST, PORT } from "./lib/get-env.js";
import apiRoute from "./route.js";

const app = express();

app.use(express.json());
app.use("/api", apiRoute);

app.listen(Number(PORT), HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});
