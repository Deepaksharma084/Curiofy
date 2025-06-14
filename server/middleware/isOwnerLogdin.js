const jwt = require('jsonwebtoken');
const ownerModel = require('../models/owner-model');

module.exports = async (req, res, next) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ error: "You need to login first" }); // Return JSON response
    }

    try {
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);
        let owner = await ownerModel.findOne({ email: decoded.email }).select("-password");
        if (!owner) {
            return res.status(401).json({ error: "Invalid authentication token" });
        }
        req.owner = owner;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: err.message }); // Return JSON response
    }
}