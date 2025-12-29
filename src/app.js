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
