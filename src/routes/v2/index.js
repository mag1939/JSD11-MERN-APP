import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js"
import { router as healthRoutes } from "./users.routes.js"

// 2nd route!
export const router = Router();

// next route
router.use("/users", usersRoutes);
router.use("/health", healthRoutes);