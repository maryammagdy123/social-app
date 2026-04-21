import mongoose from "mongoose";
import { DB_URI } from "../../config";

export const authenticateDB = async () => {
  // Database connection logic here
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("failed to connect to database!", error);
  }
};
