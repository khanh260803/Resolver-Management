// middleware/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
   const token = req.cookies.authToken;
   if (!token) {
      return res.redirect('/login'); 
   }

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
         return res.redirect('/login'); 
      }
      req.user = user;
      console.log('Authenticated user:', req.user);  
      next();
   });
};

module.exports = authenticateToken;
