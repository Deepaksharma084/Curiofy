const express = require('express');
const router = express.Router();
const { registerOwner, loginOwner, logoutOwner } = require('../controllers/authController');
const isOwnerLogdin = require('../middleware/isOwnerLogdin');

router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.get("/verify", isOwnerLogdin, (req, res) => {
    res.status(200).json({ valid: true });
});

module.exports = router;