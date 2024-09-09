const express = require('express');

const router = express.Router();
const userController = require('../controller/user');
const authentication = require('../middleware/jwt');
const multer = require('multer');
router.get('/',userController.displayHomePage);
router.get('/navigation',authentication, userController.displaynavigation);
//forget password
router.get('/forgetpass', userController.displayForget);
router.post('/forgetpass',userController.forgetpass);
//validate otp
router.get('/otp',userController.displayOtp);
router.post('/otp',userController.validateOtp);
//routes đăng nhập 
router.get('/login', userController.displayLogin);
router.post('/login',userController.login);
//logout
router.get('/logout',userController.logout);
// router.post('/login',)
router.get('/changepass',userController.displayChangePassword);
router.post('/changepass',userController.changepass);
//user setting profile

module.exports= router;