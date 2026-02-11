import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserResponse } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserResponse;
  authPayload?: AuthPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload & { name?: string; role?: string };
    req.authPayload = { userId: decoded.userId, email: decoded.email };
    req.user = {
      id: decoded.userId,
      name: decoded.name ?? "",
      email: decoded.email,
      role: (decoded.role as UserResponse["role"]) ?? "medical_professional",
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
