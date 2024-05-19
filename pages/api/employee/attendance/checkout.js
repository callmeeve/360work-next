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

    const checkOutTime = new Date();

    try {
      // Find the existing attendance record for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

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
        return res
          .status(404)
          .json({ message: "Attendance record not found for today" });
      }

      const workEndTime =
        attendance && attendance.workEnd ? new Date(attendance.workEnd) : null;
      let status;

      if (workEndTime && checkOutTime > workEndTime) {
        status = "OVER_TIME";
      } else {
        status = "LEAVE";
      }

      const updatedAttendance = await prisma.attendance.update({
        where: {
          id: attendance.id,
        },
        data: {
          checkOut: checkOutTime,
          checkOutImage: req.file ? req.file.filename : "",
          statusOut: status,
        },
      });

      return res.status(200).json(updatedAttendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating attendance" });
    }
  });
}
