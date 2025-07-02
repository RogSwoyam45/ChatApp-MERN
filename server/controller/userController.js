import User from "../models/Users.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import { generateToken } from "../utils/token.js";

export const signup = async (req, res) => {
    const { email, fullname, password, bio, profilePic } = req.body;

    try {
        if (!email || !fullname || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePicUrl = profilePic;
        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic);
            profilePicUrl = upload.secure_url;
        }

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            bio,
            profilePic: profilePicUrl || ""
        });

        const token = generateToken(newUser._id);
        res.status(201).json({ message: "User registered successfully", token, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = generateToken(userData._id);
        return res.status(200).json({ token, user: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, bio, profilePic } = req.body;
        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullname }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullname }, { new: true });
        }
        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, error: "Internal server error" });
    }
}