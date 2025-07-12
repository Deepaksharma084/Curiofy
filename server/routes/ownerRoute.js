import express from 'express';
import { registerOwner, loginOwner, logoutOwner, updateOwner } from '../controllers/authController.js';
import isOwnerLogdin from '../middleware/isOwnerLogdin.js';

const router = express.Router();

router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.get("/verify", isOwnerLogdin, (req, res) => {
    res.status(200).json({ valid: true });
});
router.put("/updateOwner", isOwnerLogdin, updateOwner);

export default router;