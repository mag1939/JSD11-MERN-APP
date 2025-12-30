import mongoose from "mongoose";
import { users } from "../../mock-db/users.js";
import { User } from "./users.model.js";
import { json } from "express";

// Refactored GET /users endpoint to implement separation of concerns (SOC)
// The all of functions in this file is called "Route Handler / Controller"

// 🔴 V1
export const getUsers1 = (req, res) => {
    res.status(200).json(users);
    // console.log(res);
}
export const createUser1 = (req, res) => {
    // req.body ข้อมูลที่มาจาก body ต้องเป็ฯในรูปแบบ JS lang เพราะฉะนั้นอย่าลืมแปลงจาก json เป็น JS
    const {name, email} = req.body;

    const newUser = {
        id: String(users.length + 1),
        name: name,
        email: email
    };

    users.push(newUser);
    res.status(201).json(newUser);
}
export const deleteUser1 = (req, res) => {
    const userId = req.params.id;
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).send(`User with id: ${userId} deleted ✅`)
    } else {
        res.status(404).send("User not found! ❌")
    }
}

// 🟢 V2
// route handler: get a single user by id from the database
export const getUser2 = async (req, res, next) => {
    const { id } = req.params;

    try {
        const doc = await User.findById(id).select("-password");

        if (!doc) {
            const error = new Error("User not found");
            return next(error);
        }

        return res.status(200).json({
            success: true,
            data: doc,
        });
    } catch (error) {
        error.name = error.name || "DatabaseError";
        error.status = 500;
        error.message = error.message || "Failed to get a user"
        return next(error);
    }
}
// route handler: get all users in the database
export const getUsers2 = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        // error.name = error.name || "DatabaseError";
        // error.status = 500;
        // error.message = error.message || "Failed to get users"
        return next(error);
    }
}
// route handler: create a new user in the database
export const createUser2 = async (req, res, next) => {
    const {username, email, password, role} = req.body;

    if (!username || !email || !password) {
        const error = new Error("Username, email and password are required.");
        error.name = "ValidationError"
        error.status = 400;
        return next(error);
    }

    try {
        // await ถ้าไม่ผ่านก็จะข้ามไป catch error ทันที
        // ถ้าสำเร็จก็ สร้าง "User" document ส่งไปที่ mongoDB_database -> collection "users"
        // mongodb will automatically "create" "users-collection" (มันเติม s ให้เอง wow!)
        const doc = await User.create({username, email, password, role});

        // แปลง doc ที่ได้มาดลับเป็น js แล้วแก้ไขด้วยการลบ password ทิ้งก่อน ระแวงเพื่อความปลอดภัย ก่อน return เป็น json กลับมา
        const safe = doc.toObject();
        delete safe.password;

        return res.status(200).json({
                success: true,
                data: safe,
            });
    } catch (error) {
        if (error.code === 11000) {
            error.status = 409;
            error.name = "DuplicateKeyError";
            error.message = "Email already in use.";
            return next(error);
        }

        error.name = error.name || "DatabaseError";
        error.message = error.message || "Failed to create a user.";
        return next(error);
    }
}
// route handler: delete a user in the database
export const deleteUser2 = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            const error = new Error("User not found...");
            return next(error);
        }

        return res.status(200).json({
            success: true,
            data: null,
        })
    } catch (error) {
        // error.message = error.message || "Failed to delete user...";
        return next(error);
    }
}
// route handler: update user database
export const updateUser2 = async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;

    try {
        const updated = await User.findByIdAndUpdate(id, body);

        if (!updated) {
            const error = new Error("User not found...");
            return next(error);
        }

        const safe = updated.toObject();
        delete safe.password;

        return res.status(200).json({
            success: true,
            data: safe,
        });

    } catch (error) {
        if (error.code === 11000) {
            // error.status = 409;
            // error.name = "DuplicateKeyError";
            // error.message = "Email already in use.";
            return next(error);
        }

        // error.name = error.name || "DatabaseError";
        // error.message = error.message || "Failed to update a user.";
        return next(error);
    }
}

