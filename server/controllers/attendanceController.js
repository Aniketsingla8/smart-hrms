import Attendance from "../models/Attendance.models.js";

export const markAttendance = async (req, res) => {
    const { userId, date, status, checkInTime, location } = req.body;

    try {
        if(!userId || !date) {
            return res.status(400).json({
                success: false,
                message: "User ID and date are required",
            });
        }
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Normalize to start of the day

        const end = new Date();
        end.setHours(23, 59, 59, 999); // Normalize to end of the day

        const existingAttendance = await Attendance.findOne({ 
            user: userId, 
            date: {
                $gte: start,
                $lte: end,
            },
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "Attendance for this user on this date already exists",
            });
        }

        const attendance = new Attendance({
            user: userId,
            date: new Date(date),
            status: status || "present",
            checkInTime: checkInTime ? new Date(checkInTime) : null,
            location: location,
        });

        await attendance.save();

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance,
        });
    } catch (error) {
        con sole.error("Error marking attendance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message,
        });
    }
}