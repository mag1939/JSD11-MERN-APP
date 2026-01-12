import { User } from "./users.model.js"
import { embedText, GEMINI_EMBEDDING_DIMS } from "../../services/gemini.client.js"

// ปั้นข้อมูลที่จะเอาไปทำ Embedding
const buildUserEmbeddingText = (userDoc) => {
    const username = userDoc?.username ? String(userDoc.username).trim() : "";
    const email = userDoc?.email ? String(userDoc.email).trim() : "";
    const role = userDoc?.role ? String(userDoc.role).trim() : "user";

    return [
        "User profile:",
        `Username: ${username}`,
        `Email: ${email}`,
        `Role: ${role}`,
    ].join("\n");
};

// จะไป embed ที่ user-id ไหนใน database
const embedUserById = async (userId) => {
    if (!userId) {
        const error = new Error("userId is required");
        error.name = "ValidationError";
        error.status = 400;
        // throw the error at you and stop the function immediadtly
        throw error;
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                "embedding.status": "PROCESSING",
                "embedding.lastAttemptAt": new Date()
            },
            $inc: {"embedding.attempts": 1,},
        },
        { new: false }
    );

    try {
        const user = await User.findById(userId).select("username email role embedding.status")

        if (!user) {
            const error = new Error("User not found");
            error.name = "NotFoundError";
            error.status = 400;
            throw error;
        }

        const text = buildUserEmbeddingText(user);
        const vector = await embedText({ text });

        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                "embedding.status": "READY",
                "embedding.vector": vector,
                "embedding.dims": GEMINI_EMBEDDING_DIMS,
                "embedding.updateAt": new Date(),
                "embedding.lastError": null,
                },
            },
            { new: false }
        );

        return {ok: true};

    } catch (error) {
        const message = String(error?.message || "Embedding failed");

        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "embedding.status": "failed",
                    "embedding.lastError": message
                },
            },
            { new: false }
        );

        return {ok: false, error: message};
    }
};

// queue รอทำ embed ทำได้ไม่ได้โยน error
export const queueEmbedUserById = (userId) => {
    setImmediate(() => {
        embedUserById(userId).catch((error) => {
            console.error("Async user embedding failed", {
                userId,
                message: error?.message,
            });
        });
    });
};