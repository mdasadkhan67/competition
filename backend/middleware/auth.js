const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret123";

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, SECRET);

        req.admin = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;