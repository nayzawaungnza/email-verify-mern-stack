require("dotenv").config();
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user.model");

const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const {sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail} = require("../mailtrap/emails.js");


const signup = async (req, res) => {
    const {email, password, name} = req.body;
    try {
        if(!email || ! password || ! name){
           throw new Error("All fields are required");
        }

        const userAlreadyExist = await User.findOne({email});
        console.log("userAlreadyExist : ",userAlreadyExist);
        
        if(userAlreadyExist){
            return res.status(400).json({
                success: false,
                message: "User already exist."
            });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000);
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24*60*60*1000

        });
        
        await user.save();
        //jwt
        generateTokenAndSetCookie(res,user._id);

        //send email
        await sendVerificationEmail(user.email, verificationToken);
        

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try{
        const user = await User.findOne({
            verificationToken: code, 
            verificationTokenExpireAt: {$gt: Date.now()}
        });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code."
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user:{
                ...user._doc,
                password: undefined,
                verificationToken: undefined,
                verificationTokenExpireAt: undefined,
                resetPasswordToken: undefined,
                resetPasswordExpireAt: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            }
        });
    }
    catch (error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
const signin = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || ! password){
           throw new Error("All fields are required.");
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist."
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Your email is not verified. Please verify your email before logging in."
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect password."
            });
        }

        user.lastLogin = Date.now();
        await user.save();
        //jwt
        generateTokenAndSetCookie(res,user._id);

        res.status(200).json({
            success: true, 
            message: "Logged in successfully.", 
            user: {
                ...user._doc,
                password: undefined,
                verificationToken: undefined,
                verificationTokenExpireAt: undefined,
                resetPasswordToken: undefined,
                resetPasswordExpireAt: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            },
        });

    }
    catch (error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpireAt = Date.now() + 1*60*60*1000; //1 hour

        await user.save();

        //send email
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Reset password email sent successfully."
        });

    }
    catch (error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const resetPassword = async (req, res) => {
    const {password} = req.body;
    const {token} = req.params;
   
    try{
        if(!password){
            return res.status(400).json({
                success: false,
                message: "Password is required."
            });
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: {$gt: Date.now()}
        });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token."
            });
        }

        //update password
        const passwordHash = await bcryptjs.hash(password, 10);

        user.password = passwordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpireAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    }
    catch (error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully."
    });
}

const verifyAuth = async (req, res) => {
    try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}

const updateProfile = async (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    if (!id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        await user.save();
        res.status(200).json({ 
                    success: true, 
                    message: "Profile updated successfully", 
                    user: {
                        ...user._doc,
                        password: undefined,
                        verificationToken: undefined,
                        verificationTokenExpireAt: undefined,
                        resetPasswordToken: undefined,
                        resetPasswordExpireAt: undefined,
                    } 
                });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = { signup, signin, logout, verifyEmail, forgotPassword, resetPassword, verifyAuth, updateProfile}