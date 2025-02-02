import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5001, () => {
      console.log("🥳🥳!!Server and database connection done!!");
    });
  })
  .catch((error) => {
    console.log("😭😭Error::", error);
    process.exit(1);
  });
