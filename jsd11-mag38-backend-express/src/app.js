import express from "express";
import { router as apiRoutes } from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { requestLimiter } from "./middlewares/rateLimiter.js";

// 1st file
// setup Express.js structure
export const app = express();

// -----------------------------Middleware------------------------------

// Bypass user proxy enter our sites from deployed services like (Vercel, Render)
app.set("trust proxy", 1);

// Global middleware, inside has so many middlewares that make your app safer?, it will set your HTTP header
app.use(helmet());

// enable CORS policy to let only some IPs can access
// use CORS with policy above
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://jsd11-mag38-react-assessment-soluti.vercel.app',
    ],
    credentials: true, // 🟢 allow cookies to be sent
};
app.use(cors(corsOptions));

// request Limiter
app.use(requestLimiter);

// convert json format to JS
app.use(express.json());

//  automatically reads incoming HTTP request headers, extracts cookie data, and makes it easily accessible as an object
app.use(cookieParser());

// set root dir
app.get("/", (req, res) => { res.send("Never gonna give you up~") });

// next route!
app.use("/api", apiRoutes);

// เมื่อ Browser ถามหาไอคอน (GET /favicon.ico)
// Server จะตอบกลับทันทีด้วย Status 204 (No Content) Browser จะรู้ว่า "ไม่มีไอคอนนะ"
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Catch-all for 404 Not Found
// For errors returned from asynchronous functions invoked by route handlers and middleware,
// you must pass them to the next() function, where Express will catch and process them to here...
app.use((req, res, next) => {
    const error = new Error( `Not found: ${req.method} ${req.originalUrl}`);
    error.name = error.name || "NotFoundError";
    error.status = error.status || 404;
    next(error);
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        stack: err.stack,
    });
});