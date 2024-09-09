

const checkRole = (roles) => {
    return  (req, res, next) => {  
        const user = req.user; 
        console.log('User role hi:', user.role);
        if (roles.includes(user.role)) {
            return next();
            
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};

module.exports = checkRole;
