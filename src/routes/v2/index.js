import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js"

// 2nd route!
export const router = Router();

// next route
router.use("/users", usersRoutes);