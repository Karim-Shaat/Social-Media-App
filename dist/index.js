import express, {} from "express";
import userRouter, { routes as userRoutes, } from "./modules/user/user.controller.js";
import { PORT } from "./config/config.js";
import { DBConnection } from "./DB/mongo.connection.js";
import chalk from "chalk";
const app = express();
app.use(express.json());
DBConnection();
app.use(userRoutes.base, userRouter);
app.use((err, req, res, next) => {
    res.status(err.statusCode).json({
        msg: err.message,
        statusCode: err.statusCode,
    });
});
app.listen(PORT, () => {
    console.log(chalk.green("Server Is Running . .. .. .. ."));
});
