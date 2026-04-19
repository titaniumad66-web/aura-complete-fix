/* Loads `.env` from project root */
import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import { ensureWebsiteUnlockColumns } from "./ensureDbSchema.ts";
import { registerRoutes } from "./routes.ts";

const app = express();
const httpServer = createServer(app);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static assets from server/uploads
app.use("/uploads", express.static("server/uploads"));
app.use("/assets", express.static("server/uploads/assets"));
app.use("/payments", express.static("server/uploads/payments"));
app.use("/ui-libs", express.static("ui-libs"));

// Log function
export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

(async () => {
  try {
    await ensureWebsiteUnlockColumns();
    log("Database: websites unlock columns verified.");
  } catch (err) {
    console.error("ensureWebsiteUnlockColumns failed:", err);
  }

  // Register API routes
  await registerRoutes(httpServer, app);

  // Serve frontend for production
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile("client/dist/index.html", { root: "." });
  });

  // Error handling middleware
  app.use((err, _req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    res.status(status).json({ message });
  });

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    log(`🚀 Server running on port ${PORT}`);
  });
})();
