import express from "express";
import type { Request, Response } from "express";
import { HOST, PORT } from "./lib/get-env.js";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server Express + TypeScript (ESM) berjalan!" });
});

app.listen(Number(PORT), HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});
