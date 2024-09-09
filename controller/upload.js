const multer = require('multer');
const path = require('path');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { where } = require('sequelize');
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

// Đường dẫn tải trang upload
exports.getUploadPage = async (req, res) => {
    console.log(req.session.email)
    try {
        const user = await User.findOne({ where: { email: req.session.email } });
        const userImage = user.image; 
        const userRole = user.role
        res.render('UserSetting', { userImage ,userRole,user}); // Truyền userImage vào view
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
// Đường dẫn xử lý upload ảnh
exports.uploadImage = async (req, res) => {
    console.log(req.file.filename)
    console.log(req.body)
  try {
      const { username, email, oldpassword, newpassword, comfirmpassword, dob } = req.body;
      const user = await User.findOne({ where: { email } });
      console.log(user.password_hash)
      if (user) {
        const isMatchPass = await bcrypt.compare(oldpassword,user.password_hash);
        console.log(isMatchPass)
          if (isMatchPass) {
              if (newpassword === comfirmpassword) {
                  const hashedNewPassword = await bcrypt.hash(newpassword, 10);
                  const filePath = `/uploads/${req.file.filename}`;
                  await User.update({ username, password_hash: hashedNewPassword, dob, image: filePath }, { where: { id: user.id } });
                  return res.json({ success: true, filePath });
              } else {
                  return res.json({ success: false, error: 'New password and confirm password do not match.' });
              }
          } else if (!oldpassword) {
              const filePath = `/uploads/${req.file.filename}`;
              await User.update({ username, dob, image: filePath }, { where: { id: user.id } });
              return res.json({ success: true, filePath });
          } else {
              return res.json({ success: false, error: 'Old password is incorrect.' });
          }
      } else {
          return res.json({ success: false, error: 'User not found.' });
      }
  } catch (error) {
      console.log('Error:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

