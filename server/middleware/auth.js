import User from "../../models/userModel.js";


export const protectRoute =async (res, req) => {
    try {
        const token = req.header.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Unauthorized access" });
    }
}

//controller for user auhthentication

export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user})
}