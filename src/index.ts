import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import userRouter, {
  routes as userRoutes,
} from "./modules/user/user.controller";
import { PORT } from "./config/config";
import { DBConnection } from "./DB/mongo.connection";
import chalk from "chalk";
import type { IError } from "./utils/error.handle";
import { userModel } from "./DB/models/user.model";

const app = express();
app.use(express.json());
DBConnection();

app.use(userRoutes.base, userRouter);

app.get("/hooks",async(req ,res)=>{
  const user = new userModel({
    fullName : "mohamed mohamed",
    email: "karim@ka.com",
    password:"karim123",
    userName: "karim sh0aat",
    phone: "0101010101"
  })
  const data = await user.save()
  console.log(data);
  
  res.json(data)

})








app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    msg: err.message,
    statusCode: err.statusCode,
  });
});

app.listen(PORT, () => {
  console.log(chalk.green("Server Is Running . .. .. .. ."));
});
