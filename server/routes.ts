import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // =========================
  // AUTH MIDDLEWARE
  // =========================
  function verifyToken(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  function verifyAdmin(req: any, res: any, next: any) {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  }

  // =========================
  // REGISTER
  // =========================
  app.post("/api/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const { username, email, password } = parsed.data;

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        token,
      });

    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // =========================
  // LOGIN
  // =========================
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
      });

    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // =========================
  // CREATE WEBSITE (Protected)
  // =========================
  app.post("/api/websites", verifyToken, async (req: any, res) => {
    try {
      const { title, theme, content } = req.body;

      const website = await storage.createWebsite({
        userId: req.user.id,
        title,
        theme,
        content,
      });

      return res.status(201).json(website);
    } catch (error) {
      console.error("Create Website Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // =========================
  // GET USER WEBSITES (Protected)
  // =========================
  app.get("/api/websites", verifyToken, async (req: any, res) => {
    try {
      const websites = await storage.getUserWebsites(req.user.id);
      return res.json(websites);
    } catch (error) {
      console.error("Fetch Websites Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // =========================
  // ADMIN ROUTE
  // =========================
  app.get(
    "/api/admin/dashboard",
    verifyToken,
    verifyAdmin,
    (req, res) => {
      return res.json({
        message: "Welcome Admin 👑",
      });
    }
  );
  // =========================
// GET WEBSITE BY ID (PUBLIC)
// =========================
app.get("/api/websites/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const website = await storage.getWebsiteById(id);

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    return res.json(website);
  } catch (error) {
    console.error("Fetch Website Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

  return httpServer;
}