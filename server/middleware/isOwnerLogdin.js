const jwt = require('jsonwebtoken');
const ownerModel = require('../models/owner-model');

module.exports = async (req, res, next) => {
    console.log('Cookies received:', req.cookies); // Add this line

    if (!req.cookies.jwt) {
        console.log('No JWT cookie found'); // Add this line
        return res.status(401).json({ error: "You need to login first" }); // Return JSON response
    }

    try {
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);
        console.log('Decoded token:', decoded); // Add this line

        let owner = await ownerModel.findOne({ email: decoded.email }).select("-password");
        if (!owner) {
            return res.status(401).json({ error: "Invalid authentication token" });
        }
        req.owner = owner;
        next();
    } catch (err) {
        console.error('Auth error:', err); // Add this line
        return res.status(401).json({ error: err.message }); // Return JSON response
    }
};