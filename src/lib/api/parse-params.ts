import AppError from "../app-error.js";

export default function parseParams(id: unknown): string{
    if (typeof id !== "string" || !id.trim()) {
      throw new AppError("ID tidak valid atau tidak ditemukan", 400);
    }
    return id
}