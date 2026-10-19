import type { NextFunction, Request, Response } from "express";
import { FRONTEND_ORIGIN } from "../lib/get-env.js";


export default function corsMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (request.get("origin") !== FRONTEND_ORIGIN) {
    next();
    return;
  }

  response.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Vary", "Origin");

  if (request.method === "OPTIONS") {
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      request.get("Access-Control-Request-Headers") ?? "Content-Type, Authorization",
    );
    response.status(204).end();
    return;
  }

  next();
}
