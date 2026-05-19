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

        req.user = decoded; // Renamed from req.admin to be generic

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: Unauthorized role"
            });
        }
        next();
    };
};

module.exports = { authMiddleware, checkRole };