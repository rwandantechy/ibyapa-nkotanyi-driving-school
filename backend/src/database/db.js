import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dburl = process.env.DB_URL;
mongoose.set("strictQuery", false);

const connectDb = async () => {
  try {
   mongoose.connect(dburl);
  
    console.log("Database connected successfully!");
    
  } catch (error) {
    console.error({ error: error.message });
  }
};

const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
    console.log("Database disconnected successfully!");
  } catch (error) {
    console.error({ error: error.message });
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.error({ error: error.message });
  }
};

export { connectDb, disconnectDb, dropDatabase, dburl };
