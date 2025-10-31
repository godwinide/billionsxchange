const checkVerification = (req, res, next) => {
    // Check if user exists and is authenticated
    if (!req.user) {
        return res.redirect('/login');
    }
    
    // Check if account is locked (upgrade flag)
    if (!req.user.upgrade) {
        return next();
    } else {
        return res.redirect('/locked');
    }
};

module.exports = checkVerification