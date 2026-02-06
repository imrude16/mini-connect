import multer from "multer";
import path from "path";

/*
  1️⃣ Define storage strategy
  - where files are saved
  - how files are named
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

/*
  2️⃣ Optional file filter
  - restrict file types
*/
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

/*
  3️⃣ Create multer instance
*/
const upload = multer({
  storage,
  fileFilter
});

export default upload;

/*
Client selects image
↓
Client sends multipart request + JWT token
↓
authMiddleware → req.userId
↓
multer → req.file
↓
controller → merges data
↓
service → saves to DB
*/
