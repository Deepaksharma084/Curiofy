const ownerModel = require('../models/owner-model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');

module.exports.registerOwner = async (req, res) => {
    try {
        let { email, password } = req.body;

        const ownerCount = await ownerModel.countDocuments();
        if (ownerCount > 0)
            return res.status(400).json({ error: "You have no rights to create owner." });

        const salt = await bcrypt.genSalt(12);
        const hashedpass = await bcrypt.hash(password, salt);

        let owner = await ownerModel.create({
            email,
            password: hashedpass,
        });

        let token = generateToken(owner);
        res.cookie('jwt', token, { httpOnly: true });

        // Sending success response
        res.status(201).json({ message: "Owner registered successfully", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.loginOwner = async (req, res) => {
    try {
        let { email, password } = req.body;

        const owner = await ownerModel.findOne({ email: email });
        if (!owner)
            return res.status(400).json({ error: "Invalid email or password" });

        bcrypt.compare(password, owner.password, async function (err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result) {
                let token = generateToken(owner);
                // Creating owner object without password
                const ownerData = {
                    _id: owner._id,
                    email: owner.email
                };

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // true in production
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
                }).status(200).json({
                    message: "Owner logged in successfully",
                    owner: ownerData
                });
            }
            else {
                res.status(400).json({ error: 'Invalid email or password' });
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports.logoutOwner = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: "Owner logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}