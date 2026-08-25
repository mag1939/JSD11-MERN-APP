import chalk from "chalk";
import { app } from "./app.js";
import { connectDB } from "./config/mongodb.js";

const port = process.env.port || 3000;



try {
    // a"wait" till this function finished, if not terminate it.
    await connectDB()

    // let our app.js run on port:....
    app.listen(port, () => {
        console.log(chalk.magenta(`Server running on port: ${chalk.redBright(port)} ✅`));
    });
} catch (error) {
    console.error("Startup falied! 🥀", error);
    process.exit(1);
}