import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded());

import authRouter from "./routes/auth.route.js";
app.use("/api/auth", authRouter);

export { app };
