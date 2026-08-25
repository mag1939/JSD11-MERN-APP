import { Router } from "express";
import {
    createUser2,
    deleteUser2,
    getUser2,
    getUsers2,
    updateUser2,
    askUsers2,
    loginUser2,
    logoutUser2,
    stayUser2} from "../../modules/users/users.controller.js";
import { authUser } from "../../middlewares/auth.js";

//  3rd route
export const router = Router();

// Endpoint routes using imported "Route Handler / Controller" functions
router.get("/", getUsers2);


// "authUser middleware" will check first if token is correct or not before run next function
router.get("/:id", getUser2)
router.post("/", authUser, createUser2);
router.delete("/:id", authUser, deleteUser2);
router.patch("/:id", authUser, updateUser2);

router.post("/auth/cookie/login", loginUser2);
router.get("/auth/cookie/me", authUser, stayUser2);
router.post("/auth/cookie/logout", logoutUser2);

// RAG (Retrieval-Augmented Generation)
router.post("/auth/ai/ask", authUser, askUsers2);