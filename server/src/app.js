import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded());

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

export { app };
