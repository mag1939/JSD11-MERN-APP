import { Router } from "express";
import {
    createUser2,
    deleteUser2,
    getUser2,
    getUsers2,
    updateUser2} from "../../modules/users/users.controller.js";

//  3rd route
export const router = Router();

// endpoint routes with the "Route Handler / Controller" function
router.get("/", getUsers2);
router.post("/", createUser2);
router.get("/:id", getUser2)
router.delete("/:id", deleteUser2);
router.patch("/:id", updateUser2)