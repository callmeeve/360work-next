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
}).single("file");

export default async function handle(req, res) {
  try {
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
  
      if (decoded.role !== "MANAGER") {
        return res.status(403).json({ message: "You are not authorized" });
      }
  
      const manager = await prisma.manager.findUnique({
        where: {
          userId: decoded.id,
        },
        include: {
          company: true,
        },
      });
  
      if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
      }
  
      const { title, description, employeeId } = req.body;
  
      if (!title || !description || !employeeId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const employee = await prisma.employee.findUnique({
        where: {
          id: parseInt(employeeId),
        },
      });
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      const task = await prisma.task.create({
        data: {
          title: title,
          description: description,
          status: "IN_PROGRESS",
          file: req.file ? req.file.filename : "",
          employee: {
            connect: {
              id: employee.id,
            },
          },
          manager: {
            connect: {
              id: manager.id,
            },
          },
        },
      });
  
      const notification = await prisma.notification.create({
        data: {
          title: task.title,
          message: `New task assigned by ${manager.company.name}`,
          read: false,
          userId: employee.userId,
        },
      });
  
      return res.status(201).json(task, notification);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
