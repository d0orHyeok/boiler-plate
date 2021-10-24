const { User } = require("../models/User");

// Auth space
const auth = (req, res, next) => {
    // Get token from client cookie
    let token = req.cookies.x_auth;
    // Decrypt token and find user
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        req.token = token;
        req.user = user;
        next();
    });
    // Find user, Okay
    // User not found, Fail
};

module.exports = { auth };
