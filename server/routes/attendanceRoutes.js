import express from "express";
import { 
    markAttendance, 
    getTodayAttendance, 
    getAllAttendanceForUser,
    updateAttendance,
    deleteAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/mark", markAttendance); // POST /api/attendance/mark
router.get("/today/:userId", getTodayAttendance);
router.get("/all/:userId", getAllAttendanceForUser);
router.put("/update/:id", updateAttendance);
router.delete("/delete/:id", deleteAttendance);

export default router;
