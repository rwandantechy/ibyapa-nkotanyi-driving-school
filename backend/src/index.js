

import express from "express";
import cors from "cors";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { connectDb } from "./database/db.js";
import route from "./routes/index.js";
import swaggerDocs from "./docs/swagger.js";
import cookieParser from 'cookie-parser';
import path from "path"; 
import { fileURLToPath } from "url";
import PaymentCleanupService from "./database/services/paymentCleanupService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init(
    {
      locales: ["en", "fr", "rw"], 
      fallbackLng: "rw", 
      defaultLocale: "rw",
      backend: {
        loadPath: path.join(__dirname, "locales", "{{lng}}.json"), 
      },
      detection: {
        // Prefer client-provided header over cookie to keep backend in sync
        order: ["header", "querystring", "cookie"],
        // Do not cache into cookies automatically to avoid stale values
        caches: [],
        lookupHeader: "accept-language",
        lookupQuerystring: "lng",
        lookupCookie: "lang",
        cookie: "lang",
      },
    },
    (err) => {
      if (err) console.error("i18next initialization error:", err);
    }
  );

const app = express();
// Respect X-Forwarded-* headers when behind a reverse proxy (e.g., Nginx)
// Use "1" to trust the first proxy hop in typical single-proxy setups
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(middleware.handle(i18next));
app.use(cors({ origin: "*", credentials: true })); //important for 
app.use(express.json());


// Use a browser-safe default port (6000 is blocked by browsers). Default to 5000.
// Default to port 3001 (browser-safe). Can be overridden via PORT env var
const port = process.env.PORT || 3001;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`[Server] Listening on port ${port}. Database connected.`);

    // Schedule regular cleanup every 30 minutes to keep analytics consistent
    const runCleanup = async () => {
      try {
        await PaymentCleanupService.moveFailedPayments(30);
        await PaymentCleanupService.moveExamExpiredPayments();
        console.log("[Server] Payment cleanup completed successfully.");
      } catch (e) {
        console.error("[Server] Payment cleanup failed:", e.message);
      }
    };
    // run once shortly after start, then at interval
    setTimeout(runCleanup, 15_000);
    setInterval(runCleanup, 30 * 60 * 1000);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] Graceful shutdown (SIGINT) initiated.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Server] Graceful shutdown (SIGTERM) initiated.');
  process.exit(0);
});


app.use("/api", route); 
swaggerDocs(app);

export default app;