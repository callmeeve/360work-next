import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import cron from "node-cron";

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
    // accept all file types
    if (file.size > 1024 * 1024 * 5) {
      return cb(new Error("File size should be less than 5MB"), false);
    }
    cb(null, true);
  },
}).single("image");

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
          manager: true,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching employee" });
    }

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const checkInTime = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance;
    try {
      attendance = await prisma.attendance.findFirst({
        where: {
          employeeId: employee.id,
          createdAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching attendance" });
    }

    if (attendance) {
      return res
        .status(404)
        .json({ message: "Attendance record already exists for today" });
    }

    const workStartTime = employee.workStart ? new Date(employee.workStart) : null;
    let status;

    if (workStartTime && checkInTime > workStartTime) {
      status = "LATE";
    } else {
      status = "PRESENT";
    }

    try {
      const attendanceRecord = await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          checkIn: checkInTime,
          checkInImage: req.file ? req.file.filename : "",
          statusIn: status,
        },
      });
      return res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating attendance" });
    }
  });
}


// Schedule task to run at 23:59 every day to mark absent employees
cron.schedule("59 23 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await prisma.employee.findMany();

    for (const employee of employees) {
      const attendance = await prisma.attendance.findFirst({
        where: {
          employeeId: employee.id,
          createdAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      if (!attendance) {
        await prisma.attendance.create({
          data: {
            employeeId: employee.id,
            statusIn: "ABSENT",
            checkIn: null,
            checkOut: null,
            createdAt: today,
          },
        });
      }
    }

    console.log("Daily absence check completed");
  } catch (error) {
    console.error("Error checking absences:", error);
  }
});
