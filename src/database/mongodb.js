import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`Connected to database on ${NODE_ENV} mode`);
    console.log("");
  } catch (error) {
    console.log("Connection to database failed: ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
