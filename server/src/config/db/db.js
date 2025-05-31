// Database connection setup
import mongoose from "mongoose";
import chalk from "chalk";
import config from "../environment/default.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // These options are no longer needed in newer versions of mongoose
      // but keeping them for compatibility with older versions
    });

    console.log(chalk.green.bold(`MongoDB Connected: ${conn.connection.host}`));
    return conn;
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
