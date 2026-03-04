import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUserSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { generateBirthdayContent } from "./aiService";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const templatesDir = path.resolve("server", "uploads", "templates");
  const upload = multer({
    storage: multer.diskStorage({
      destination: async (_req, _file, cb) => {
        try {
          await fs.promises.mkdir(templatesDir, { recursive: true });
          cb(null, templatesDir);
        } catch (error) {
          cb(error as Error, templatesDir);
        }
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${nanoid()}${ext}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
        return;
      }
      cb(new Error("Only image uploads are allowed"));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });

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
  // TEMPLATES (PUBLIC LIST)
  // =========================
  app.get("/api/templates", async (_req, res) => {
    try {
      const templates = await storage.getTemplates();
      return res.json(templates);
    } catch (error) {
      console.error("Fetch Templates Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // =========================
  // CREATE TEMPLATE (ADMIN)
  // =========================
  app.post(
    "/api/templates",
    verifyToken,
    verifyAdmin,
    upload.single("image"),
    async (req: any, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "Image is required" });
        }

        const rawName = typeof req.body?.name === "string" ? req.body.name : "";
        const rawTitle = typeof req.body?.title === "string" ? req.body.title : "";
        const resolvedTitle = (rawName || rawTitle).trim();
        const title = resolvedTitle ? resolvedTitle : "Untitled Template";

        const imageUrl = `/uploads/templates/${req.file.filename}`;

        const template = await storage.createTemplate({
          title,
          imageUrl,
        });

        return res.status(201).json(template);
      } catch (error) {
        console.error("Create Template Error:", error);
        return res.status(500).json({ message: "Server error" });
      }
    }
  );

  // =========================
  // DELETE TEMPLATE (ADMIN)
  // =========================
  app.delete(
    "/api/templates/:id",
    verifyToken,
    verifyAdmin,
    async (req, res) => {
      try {
        const { id } = req.params;
        const template = await storage.getTemplateById(id);
        if (!template) {
          return res.status(404).json({ message: "Template not found" });
        }

        await storage.deleteTemplate(id);

        if (template.imageUrl) {
          const filePath = path.resolve(
            "server",
            "uploads",
            "templates",
            path.basename(template.imageUrl)
          );
          fs.promises.unlink(filePath).catch(() => null);
        }

        return res.json({ message: "Template deleted" });
      } catch (error) {
        console.error("Delete Template Error:", error);
        return res.status(500).json({ message: "Server error" });
      }
    }
  );
  // =========================
  // AI ASSISTANT
  // =========================
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
      const context = req.body?.context && typeof req.body.context === "object" ? req.body.context : null;
      const contextName = typeof context?.name === "string" ? context.name : "";
      const contextRelationship = typeof context?.relationship === "string" ? context.relationship : "";
      const contextTheme = typeof context?.theme === "string" ? context.theme : "";
      const contextConfession =
        typeof context?.confessionMode === "boolean" ? context.confessionMode : false;
      const contextMemories =
        typeof context?.memoriesCount === "number" ? context.memoriesCount : undefined;
      const contextMessage = typeof context?.message === "string" ? context.message : "";
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const lower = message.toLowerCase();
      const relationshipLower = contextRelationship.toLowerCase();
      const themeLower = contextTheme.toLowerCase();
      const targetName = contextName || "them";
      const looksLikeImprove =
        lower.includes("improve") ||
        lower.includes("rewrite") ||
        lower.includes("make it more") ||
        lower.includes("polish") ||
        lower.includes("emotional") ||
        lower.includes("romantic");

      if (looksLikeImprove && (contextMessage || message).length > 20) {
        const base = contextMessage || message;
        const confessionLine = contextConfession
          ? "I’ve been meaning to say this for a while, and I hope it brings a gentle smile."
          : "";
        const relationshipLine =
          relationshipLower === "best friend"
            ? "You’ve been my favorite constant through every adventure and every laugh."
            : relationshipLower === "family"
              ? "Your love and support have shaped me in the best ways."
              : relationshipLower === "crush"
                ? "Every moment with you feels special, even from afar."
                : "You make life feel brighter and more meaningful.";
        return res.json({
          reply:
            "Here’s a more emotional version:\n\n" +
            `Happy Birthday ${contextName || ""}! ${relationshipLine} ${confessionLine} ` +
            "Today is all about celebrating the light you bring into the world, and I hope this surprise " +
            "wraps you in warmth, joy, and love. You deserve a day as unforgettable as you are.\n\n" +
            `Original: ${base}`,
        });
      }

      if (lower.includes("crush") || relationshipLower === "crush") {
        return res.json({
          reply:
            "For a crush, Romantic or Pastel works best. If Confession Mode is on, keep it subtle: warm gradients, soft text, and a gentle reveal make it feel sweet without being too intense.",
        });
      }

      if (lower.includes("theme") || lower.includes("vibe") || themeLower) {
        const themeAdvice =
          themeLower === "royal"
            ? "Royal pairs well with elegant phrasing, gold accents, and a dramatic reveal."
            : themeLower === "funny"
              ? "Funny works best with playful language, bright colors, and bold memories."
              : themeLower === "emotional"
                ? "Emotional thrives on warm pastels, soft fades, and heartfelt lines."
                : themeLower === "minimal"
                  ? "Minimal feels modern with clean typography and short, intentional sentences."
                  : themeLower === "pastel"
                    ? "Pastel is dreamy and soft, with gentle gradients and airy text."
                    : "Romantic shines with serif typography and tender, affectionate messages.";
        return res.json({
          reply:
            `${themeAdvice} Choose the vibe that mirrors your relationship: Romantic for partners, Emotional for heartfelt notes, Funny for best friends, Royal for dramatic luxury, Minimal for clean modern energy, and Pastel for dreamy softness.`,
        });
      }

      if (lower.includes("memories") || lower.includes("photos") || typeof contextMemories === "number") {
        const countHint =
          typeof contextMemories === "number"
            ? `You currently have ${contextMemories} memories. `
            : "";
        return res.json({
          reply:
            `${countHint}For the best flow, add 5–8 memories. That keeps the gallery feeling rich without overwhelming the surprise moment.`,
        });
      }

      if (lower.includes("features") || lower.includes("what can") || lower.includes("how does aura")) {
        return res.json({
          reply:
            "Aura helps you build birthday surprise websites with a reveal gate, music playback, memory gallery, Instagram teaser generator, shareable links, QR code sharing, replay surprise animation, and downloadable templates.",
        });
      }

      return res.json({
        reply:
          `Aura AI can guide you through themes, messages, and design choices. Tell me who it’s for and the vibe you want, and I’ll recommend the best setup for ${targetName}.`,
      });
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/ai/generate-birthday", async (req, res) => {
    try {
      const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
      const relationship = typeof req.body?.relationship === "string" ? req.body.relationship.trim() : "";
      const theme = typeof req.body?.theme === "string" ? req.body.theme.trim() : "";
      const tone = typeof req.body?.tone === "string" ? req.body.tone.trim() : theme || relationship || "romantic";
      const memories = Array.isArray(req.body?.memories) ? req.body.memories : [];

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const result = await generateBirthdayContent({
        name,
        relationship,
        theme,
        tone,
        memories,
      });

      return res.json(result);
    } catch (error) {
      console.error("AI Generate Birthday Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
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
