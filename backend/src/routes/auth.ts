import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "../config/db.js";
import type { User, UserResponse } from "../types/index.js";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const SALT_ROUNDS = 10;

function toUserResponse(user: User & { _id: string }): UserResponse {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are required" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const db = await connectDb();
    const users = db.collection<User>("users");
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const doc: Omit<User, "_id"> = {
      email: email.toLowerCase(),
      name: name.trim(),
      passwordHash,
      role: "medical_professional",
      createdAt: new Date(),
    };
    const insert = await users.insertOne(doc as User);
    const user = await users.findOne({ _id: insert.insertedId }) as User & { _id: string };
    if (!user) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ user: toUserResponse(user), token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const db = await connectDb();
    const users = db.collection<User>("users");
    const user = await users.findOne({ email: email.toLowerCase() }) as (User & { _id: string }) | null;
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ user: toUserResponse(user), token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ user: req.user });
});

export default router;
