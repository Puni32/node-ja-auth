import bcrypt from 'bcryptjs';
import userModel from '../models/user.js';
import jwt from 'jsonwebtoken';

// Register controller
const registeruser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please try with another email or username.',
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            role,
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            return res.status(201).json({
                success: true,
                message: 'User registered successfully!',
                user: savedUser,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Unable to register user.',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again.',
        });
    }
};

// Login controller
const loginuser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid username or password',
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials!',
            });
        }

        // Create access token
        const accessToken = jwt.sign(
            {
                userid: user._id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '15m',
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Some error occurred! Please try again.',
            success: false,
        });
    }
};

const changepassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId; // Assuming you have middleware to add userInfo to the request

        // Extract old and new password
        const { oldpassword, newpassword } = req.body;

        // Find the current logged-in user
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Compare old password
        const isPasswordMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect!',
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred! Please try again.',
        });
    }
};

export { registeruser, loginuser, changepassword };