/* Loads `.env` from project root */
import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { ensureWebsiteUnlockColumns } from "./ensureDbSchema.ts";
import { registerRoutes } from "./routes.ts";

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: [
    "https://aura-complete-fix.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static assets from server/uploads
app.use("/uploads", express.static("server/uploads"));
app.use("/assets", express.static("server/uploads/assets"));
app.use("/payments", express.static("server/uploads/payments"));
app.use("/ui-libs", express.static("ui-libs"));

// Error handling middleware (must be registered after routes)
function registerErrorHandler() {
  app.use((err: any, _req: any, res: any, next: any) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    res.status(status).json({ message });
  });
}

(async () => {
  try {
    await ensureWebsiteUnlockColumns();
    console.log("Database: websites unlock columns verified.");
  } catch (err) {
    // Do not crash on deploy if DB is temporarily unavailable.
    console.error("ensureWebsiteUnlockColumns failed:", err);
  }

  // Register API routes
  await registerRoutes(httpServer, app);

  // Serve frontend for production
  if (process.env.NODE_ENV !== "production") {
    app.use(express.static("client/dist"));
    app.get("*", (_req, res) => {
      res.sendFile("client/dist/index.html", { root: "." });
    });
  }

  registerErrorHandler();

  const PORT = process.env.PORT || 10000;
  httpServer.on("error", (err: any) => {
    const code = err?.code ? String(err.code) : "UNKNOWN";
    const msg = err?.message ? String(err.message) : String(err);
    console.error(`[server] listen error (${code}): ${msg}`);
    process.exit(1);
  });

  httpServer.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

