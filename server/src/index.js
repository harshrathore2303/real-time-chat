import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { server, app } from "./utils/socket.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config({
  path: "./.env",
});

const __dirname = path.resolve();

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 5001, () => {
      console.log("🥳🥳!!Server and database connection done!!");
    });
  })
  .catch((error) => {
    console.log("😭😭Error::", error);
    process.exit(1);
  });

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({
  extended: true
}))
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use(express.urlencoded());

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);