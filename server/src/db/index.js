import mongoose from "mongoose";
import dotenv from "dotenv";
import {DB_NAME} from "../constant.js"

dotenv.config({
    path: "./.env"
})

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("🎉🎉!!Server Connected to database!!🎉🎉")
    } catch (error) {
        console.error("😭Error::", error);
        process.exit(1);
    }
}

export default connectDB;