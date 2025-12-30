import express from "express";
import { router as apiRoutes } from "./routes/index.js";
import cors from "cors";

// 1st file
// setup Express.js structure
export const app = express();

// enable CORS policy to let only some IPs can access
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://jsd11-mag38-react-assessment-soluti.vercel.app',
    ]
};

// use CORS with policy above
app.use(cors(corsOptions));
// convert json format to JS
app.use(express.json());
// next route!
app.use("/api", apiRoutes);

// Catch-all for 404 Not Found
// For errors returned from asynchronous functions invoked by route handlers and middleware,
// you must pass them to the next() function, where Express will catch and process them
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