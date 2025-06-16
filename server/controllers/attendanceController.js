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
        const start = new Date(date);
        start.setHours(0, 0, 0, 0); // Normalize to start of the day

        const end = new Date(date);
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
            date: start,
            status: status || "present",
            checkInTime: checkInTime ? new Date(checkInTime) : new Date(),
            location: location,
        });

        await attendance.save();

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance,
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message,
        });
    }
}

export const getTodayAttendance = async (req, res) => {
  const { userId } = req.params;

  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: start, $lte: end },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No attendance marked for today",
      });
    }

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

export const getAllAttendanceForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ user: userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching all attendance records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance records",
      error: error.message,
    });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status, checkInTime, location } = req.body;

  try {
    const updated = await Attendance.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(checkInTime && { checkInTime: new Date(checkInTime) }),
        ...(location && { location }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: updated,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

export const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete attendance",
      error: error.message,
    });
  }
};
