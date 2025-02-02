import {Router} from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.get("/user", verifyJWT, getUsersForSidebar);

router.get("/:id", verifyJWT, getMessages);

router.post("/send/:id", verifyJWT, sendMessage)

export default router;