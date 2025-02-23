import multer from 'multer';

// Set up Multer storage
const storage = multer.memoryStorage(); // or use diskStorage

const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error("No file uploaded"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
