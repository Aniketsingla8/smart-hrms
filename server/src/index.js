import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/index.js';
import attendanceRoutes from '../routes/attendanceRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/attendance', attendanceRoutes);

dotenv.config({
    path: '../env',
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB()
