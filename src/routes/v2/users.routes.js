import { Router } from "express";
import {
    createUser2,
    deleteUser2,
    getUser2,
    getUsers2,
    updateUser2} from "../../modules/users/users.controller.js";
import { User } from "../../modules/users/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUser } from "../../middlewares/auth.js";

//  3rd route
export const router = Router();

// Endpoint routes using imported "Route Handler / Controller" functions
router.get("/", getUsers2);
router.post("/", authUser, createUser2);
router.get("/:id", getUser2)
router.delete("/:id", authUser, deleteUser2);
router.patch("/:id", authUser, updateUser2);

// Endpoint route: Login a user - jwt sign token (token in cookies)
router.post("/auth/cookie/login", async (req, res, next) => {
    // decontruct data "from body in reqest"
    const {email, password} = req.body;

    // check if we got both email and password if not return error
    // "always put a validation everytime we got a new data!"
    if (!email || !password) {
        res.status(400).json({
            error: true,
            message: "Email and Password are required..."
        });
    }

    try {
        // trim and lowerCase before compare it to data from database
        // tldr normalize; to clean the data make it ready to validation
        const normalizedEmail = String(email).trim().toLowerCase();

        // เอา password ออกมาด้วย จะเอาไปเช็ค
        const userDoc = await User.findOne({email: normalizedEmail}).select("+password");

        // เมื่อหา user ไม่เจอก็ return error
        if (!userDoc) {
            return res.status(401).json({
                error: true,
                massage: "User not found..."
            });
        }

        // เทียบ password in database กับที่ user พิมพ์เข้ามา ใช้ bcrypt.compare ช่วยในการเทียบ
        // แปลง one-way แปลงกลับไม่ได้ แต่ยังเอามาเทียบได้ด้วย function นี้
        const isMatched = await bcrypt.compare(password, userDoc.password);

        // password ไม่ตรงก็ return error
        if (!isMatched) {
            return res.status(401).json({
                error: true,
                message: "Invalid credentials",
            })
        }

        // Generate JSON Web Token
        // มีอายุขัยการใช้งาน
        const token = jwt.sign(
            {userId: userDoc._id},
            process.env.JWT_SECRET,
            {expiresIn: "1h"},
        );

        const isProd = process.env.NODE_ENV === "production"

        // บรรจุ token inside "cookie" and response back
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(200).json({
            error: false,
            message: "Login successful",
            token: token,
            user: {
                _id: userDoc._id,
                username: userDoc.username,
                email: userDoc.email,
                role: userDoc.role,
            },
        });

    } catch (error) {
        next(error);
    }
});

// Endpoint route: Logout a user
router.post("/auth/cookie/logout", async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });

    res.status(200).json({
        error: false,
        message: "Logged out successfully",
    });
});

// Check user authentication (check if user has valid token)
// "authUser middleware" will check first if token is correct or not before run next function
router.get("/auth/cookie/me", authUser, async (req, res, next) => {
    try {
        const userId = req.user.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "Unauthenticated"
            });
        }

        res.status(200).json({
            error: false,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        next(error);
    }
});