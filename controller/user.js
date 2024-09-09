
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { where } = require('sequelize');
const { extensions } = require('sequelize/lib/utils/validator-extras');
const multer = require('multer');
require('dotenv').config();

exports.getAllUser = async (req, res) => {
   try {
      const users = await User.findAll();
      res.json(users);
   } catch (error) {
      z
      res.status(500).send(error.message);
   }
};
//login
//render_login
exports.displayLogin = async (req, res) => {
   res.render('login')

}
//logic_login
exports.login = async (req, res) => {
   console.log(req.body);
   const { email, password } = req.body;
   req.session.email = email;

   console.log('session', req.session.email);
   if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
   }

   try {
      const user = await User.findOne({ where: { email } });

      // Kiểm tra xem user có tồn tại hay không trước khi thực hiện các thao tác khác
      if (!user) {
         return res.status(401).json({ message: 'Email not exist' });
      }

      if (!await bcrypt.compare(password, user.password_hash)) {
         return res.status(401).json({ message: 'Password not match enter again!' });
      }

      req.session.id = user.id;
      console.log(req.session.id);

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token:', token);
      
      res.cookie('authToken', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'Strict',
         maxAge: 3600000
      });

      res.json({ message: 'Login successful' });
   } catch (error) {
      res.status(500).send(error.message);
   }
};

//forgetpass
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   }
});

function generateRandomNumber() {
   return Math.floor(100000 + Math.random() * 900000);
}


exports.forgetpass = async (req, res) => {
   const { email } = req.body;
   req.session.email = email;
   try {
      // tìm kiếm người dùng có tồn tại không
      const user = await User.findOne({ where: { email } });
      if (!user) {
         return res.status(404).json({ message: 'Email không tồn tại' });
      }
      //lưu user id vào session
      req.session.user_id = user.id;
      // tạo random otp
      const otp = generateRandomNumber();
      req.session.otp = otp;
      console.log('OTP for forget password:', req.session.otp);
      // form gửi otp về
      const content = {
         from: '"Management" <test@gmail.com>',
         to: email,
         subject: 'Reset Password',
         html: `<b>Your OTP is</b> ${otp}`,
      };
      // Send email
      transporter.sendMail(content, (err, info) => {
         if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ message: 'Send email failed', error: err.message });
         } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Send email successful' });
         }
      });
   } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ message: "Server failed" });
   }
};

//validate otp
exports.validateOtp = (req, res) => {
   console.log(req.body)
   const { otp } = req.body;

   console.log('Received OTP:', otp);
   console.log('Stored OTP:', req.session.otp);


   if (parseInt(otp) === req.session.otp) {
      // res.status(200).json({ message: "Validate OTP successful" });
      res.redirect('changepass');
   } else {
      res.status(400).json({ message: "Validate OTP failed" });
   }

}
exports.changepass = async (req, res) => {
   console.log(req.body)
   const { newpass, comfirmpass } = req.body;
   console.log(newpass)
   console.log('hi')
   console.log(comfirmpass);
   console.log(req.session.email);
   try {
      console.log("1")
      const pass = await User.findOne({ where: { email: req.session.email } });
      console.log('hi', pass.password_hash);
      //trường hợp password cũ không trùng với password register

      if (newpass !== comfirmpass) {
         res.status(400).json({ message: 'new pass not match with comfirmpass' })
      } else {
         const hash_password = await bcrypt.hash(newpass, 10);
         console.log(1);
         const password = await User.update({ password_hash: hash_password }, { where: { email: req.session.email } });
         console.log('new pass', password)
         res.redirect('/login')

      }
   } catch (error) {
      console.log('fail')
   }
}
//logout
exports.logout = (req, res) => {
   req.session.destroy(err => {
      if (err) {
         return res.status(500).json({ message: 'logout fail' });
      }
   })
   res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
   });

   // res.status(200).json({ message: 'logout succesfull' })

   // res.json({ message: 'Logout successful' });
   res.redirect('login');
};

exports.displayHome = (req, res) => {
   res.render('home')
}
exports.displayForget = (req, res) => {
   res.render('forgetpass')
}
exports.displaynavigation = async (req, res) => {
   try {
      const user = await User.findOne({ where: { email: req.session.email } });
      const userImage = user.image; // Lấy đường dẫn ảnh từ database
      const userRole = user.role;
      res.render('navigation', { userImage, userRole }); // Truyền userImage vào view
   } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Internal Server Error');
   }
}
exports.displayOtp = (req, res) => {
   res.render('EnterOtp')
}

exports.displayHomePage = (req, res) => {
   res.render('home')
}
exports.displayChangePassword = (req, res) => {
   res.render('changepassword')
}
