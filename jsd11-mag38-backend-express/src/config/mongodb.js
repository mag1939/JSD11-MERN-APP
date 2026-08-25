import mongoose from "mongoose";
import chalk from "chalk";

export async function connectDB(){
    // trying to connect to DB
    const uri = process.env.MONGODB_URI;

    try {
        // a"wait" for this line to finish first, it try to connecto to the mongoDB database name "..." if we don't have it, it'll create and connect to it.
        await mongoose.connect(uri, {dbName: "jsd11-express-app-mag38"});
        console.log(chalk.greenBright("MongoDB connected ✅"))
    } catch (error) {
        console.error("MongoDB connection error 🥀 |", error)
        // terminate the sync process
        process.exit(1);
    }

}