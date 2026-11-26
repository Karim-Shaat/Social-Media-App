import mongoose from "mongoose";
import { MONGO_URI } from "../config/config";
import chalk from "chalk";

export const DBConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(chalk.green("DB Connection Successfully"));
  } catch (error) {
    console.log(chalk.red("DB Connection Failed"));
  }
};
