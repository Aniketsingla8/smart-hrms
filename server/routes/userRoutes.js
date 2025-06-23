import express from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    changePassword,
    refreshAccessToken 
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",verifyJWT, logoutUser);
router.post("/change-password",verifyJWT, changePassword);
router.post("/refresh-token", refreshAccessToken);

export default router;
