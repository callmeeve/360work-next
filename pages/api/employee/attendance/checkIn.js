import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const currentPath = path.join(process.cwd(), "public/uploads");
fs.mkdir(currentPath, { recursive: true }, (err) => {
  if (err) throw err;
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, currentPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // limit file size to 5MB
  },
  fileFilter: function (req, file, cb) {
    // accept only files with extension .jpg, .jpeg, .png, .gif
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    } else if (file.size > 1024 * 1024 * 5) {
      return cb(new Error("File size should be less than 5MB"), false);
    }
    cb(null, true);
  },
}).single("file");

export default async function handler(req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (decoded.role !== "EMPLOYEE") {
      return res.status(403).json({ message: "You are not authorized" });
    }

    let employee;
    try {
      employee = await prisma.employee.findUnique({
        where: {
          userId: decoded.id,
        },
        include: {
          Manager: true,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching employee" });
    }

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const schedule = await prisma.schedule.findFirst({
      where: {
        employeeId: employee.id,
        startDate: {
          lte: todayString,
        },
        endDate: {
          gte: todayString,
        },
      },
    });

    if (!schedule) {
      return res.status(404).json({ message: "No schedule found for today" });
    }

    const checkInTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      schedule.startTime.getHours(),
      schedule.startTime.getMinutes()
    );

    let status = "PRESENT";

    if (today < checkInTime) {
      return res.status(400).json({ message: "Too early to check in" });
    } else if (today > checkInTime) {
      status = "LATE";
    }

    // Check if there's already an attendance record for today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayString,
      },
    });

    // If there's no attendance record for today, create one with status "ABSENT"
    if (!existingAttendance) {
      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: today,
          image: req.file ? req.file.filename : "",
          status: "ABSENT",
        },
      });
    }

    try {
      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          scheduleId: schedule.id,
          checkInTime: today,
          image: req.file ? req.file.filename : "",
          status: status,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating attendance" });
    }

    return res.status(201).json({ message: "Checked in successfully" });
  });
}
