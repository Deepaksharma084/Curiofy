import ownerModel from '../models/owner-model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

export async function registerOwner(req, res) {
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
        
        // Sending success response
        res.status(201).json({ message: "Owner registered successfully", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export async function loginOwner(req, res) {
    try {
        let { email, password } = req.body;
        const owner = await ownerModel.findOne({ email: email });

        if (!owner) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const result = await bcrypt.compare(password, owner.password);
        if (result) {
            let token = generateToken(owner);
            const ownerData = {
                _id: owner._id,
                email: owner.email
            };

            return res.status(200).json({
                message: "Owner logged in successfully",
                owner: ownerData
            });
        }
        else {
            return res.status(400).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export async function logoutOwner(req, res) {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: "Owner logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export async function updateOwner(req, res) {
    try {
        const { email, password } = req.body;
        const updates = {};
        if (email) updates.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);
            updates.password = hashedPassword;
        }
        const updatedOwner = await ownerModel.findByIdAndUpdate(
            req.owner._id,
            updates,
            { new: true, select: "-password" }
        );
        res.status(200).json({ message: "Owner updated successfully", owner: updatedOwner });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};