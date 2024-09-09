
const express = require('express')
const app = express();
const session =require('express-session');
const port = 3000
const path = require('path');
//import Router
const userRouter = require('./routes/user');
const userSetting = require('./routes/upload');
const adminSetting = require('./routes/admin');

const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, cookie: {
    maxAge: 30 * 60 * 1000 // Thời gian session tồn tại: 30 phút (tính bằng milliseconds)
  }} // Đặt thành true nếu sử dụng HTTPS
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/',userRouter);
app.use(userSetting);

app.use(adminSetting);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})