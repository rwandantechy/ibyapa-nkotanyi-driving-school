import multer from "multer";
import path from "path";

export const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif",'.pdf'];
    if (allowedExtensions.includes(extname)) {
      return cb(null, true);
    } else {
      return cb(new Error("Unsupported file type"), false);
    }
  },
});
