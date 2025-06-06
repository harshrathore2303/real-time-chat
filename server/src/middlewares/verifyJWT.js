import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token)
        if (!token){
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user){
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;

        next();
    } catch (error) {
        console.error("Error:::", error);
        process.exit(1);
    }
};
