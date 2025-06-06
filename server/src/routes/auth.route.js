import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { signup } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";


const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", verifyJWT, updateProfile);

router.get("/check", verifyJWT, checkAuth);

export default router;
