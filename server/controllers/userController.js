import User from "../models/User.models";
import jwt from "jsonwebtoken";

const generateAccessTokenandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new Error("Failed to generate tokens");
    }
}

export const registerUser = async (req, res) => {
    const { name, email, password, role, department } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        const user = new User({
            name,
            email,
            password,
            role: role || "employee",
            department,
        });

        await user.save();

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to create user",
            });
        }   

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error.message,
        });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true, // Use secure cookies in production
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: loggedInUser._id,
                name: loggedInUser.name,
                email: loggedInUser.email,
                role: loggedInUser.role,
                department: loggedInUser.department,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to log in",
            error: error.message,
        });
    }
}

export const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user.id, 
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true, // Use secure cookies in production
    }

    return res.status(200)
        .clearCookie("accessToken", "", options)
        .clearCookie("refreshToken", "", options)
        .json({
            success: true,
            message: "User logged out successfully",
        });
}

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success: false,
            message: "unauthorized request",
        });
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        if(incomingRefreshToken !== user?.refreshToken) {
            return res.status(403).json({
                success: false,
                message: "Refresh token expired or used",
            });
        }

        const options = {
            httpOnly: true,
            secure: true, // Use secure cookies in production
        }

        const { accessToken, newRefreshToken } = await generateAccessTokenandRefreshToken(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                success: true,
                message: "Access token refreshed successfully",
                accessToken: accessToken,
                refreshToken: newRefreshToken,
            });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to refresh access token",
            error: error.message,
        });
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Old password is incorrect",
        });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
}

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword
}