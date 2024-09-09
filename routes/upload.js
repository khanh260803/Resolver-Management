const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadController = require('../controller/upload');
const authenticateToken = require('../middleware/jwt');
const checkRole = require('../middleware/authRole');
const adminController = require('../controller/admin');
const router = express.Router();
router.use(authenticateToken);
// Cấu hình lưu trữ file với Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Display user-setting page
//user/upload
router.get('/upload',checkRole(['Admin']), uploadController.getUploadPage);

// Handle image upload
router.post('/upload', upload.single('image'),checkRole(['Admin']), uploadController.uploadImage);

module.exports = router;
