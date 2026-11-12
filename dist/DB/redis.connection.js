import { createClient } from "redis";
import { REDIS_URI } from "../config/config.js";
import chalk from "chalk";
export const redisClient = createClient({
    url: REDIS_URI,
    database: 0,
});
redisClient.on("error", (err) => console.log(chalk.red("redis client error"), err))
    .on("connect", () => console.log(chalk.green("redis client connect")))
    .connect();
