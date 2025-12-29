import { Router } from "express";
import { router as v1Routes } from "./v1/index.js";
import { router as v2Routes } from "./v2/index.js";

// 1st route!
export const router = Router();


// next routes
router.use("/v1", v1Routes);
router.use("/v2", v2Routes);