import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent", "leave"],
            default: "present",
        },
        checkInTime: {
            type: Date,
        },
        location: {
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number,
            },
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true }); // Ensure unique attendance per user per day

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;