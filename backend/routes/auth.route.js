const express = require("express");
const {verifyToken}  = require("../middleware/verifyToken");
const { signup, signin, logout, verifyEmail, forgotPassword, resetPassword, verifyAuth, updateProfile } = require("../controllers/auth.controller");

const router = express.Router();


router.get('/verify-auth', verifyToken, verifyAuth);

router.post('/update-profile/:id', updateProfile);

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/verify-email',verifyEmail);

router.post('/forgot-password',forgotPassword);

router.post('/reset-password/:token',resetPassword);



router.post('/logout', logout);

module.exports = router