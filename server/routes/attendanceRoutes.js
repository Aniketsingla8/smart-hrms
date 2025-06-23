import express from "express";
import { 
    markAttendance, 
    getTodayAttendance, 
    getAllAttendanceForUser,
    updateAttendance,
    deleteAttendance
} from "../controllers/attendanceController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/mark",verifyJWT, markAttendance); // POST /api/attendance/mark
router.get("/today/:userId",verifyJWT, getTodayAttendance);
router.get("/all/:userId",verifyJWT, getAllAttendanceForUser);
router.put("/update/:id",verifyJWT, updateAttendance);
router.delete("/delete/:id",verifyJWT, deleteAttendance);

export default router;
