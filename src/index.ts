import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import userRouter, {
  routes as userRoutes,
} from "./modules/user/user.controller.js";
import { PORT } from "./config/config.js";
import { DBConnection } from "./DB/mongo.connection.js";
import chalk from "chalk";
import type { IError } from "./utils/error.handle.js";

const app = express();
app.use(express.json());
DBConnection();

app.use(userRoutes.base, userRouter);

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode).json({
    msg: err.message,
    statusCode: err.statusCode,
  });
});

app.listen(PORT, () => {
  console.log(chalk.green("Server Is Running . .. .. .. ."));
});
