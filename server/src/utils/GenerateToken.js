import dotenv from "dotenv";
import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

dotenv.config({
  path: "./.env",
});

const GenerateToken = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (error) {
    console.error("😭😭Error from generatetoken.js::", error);
    process.exit(1);
  }
};

export default GenerateToken;
