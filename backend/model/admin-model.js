const Admin = require("../schema/admin-schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret123";


// ✅ Register Admin (use once or seed)
const registerAdmin = async (data) => {
    try {
        const exist = await Admin.findOne({ email: data.email });

        if (exist) {
            return { status: 409, message: "Admin already exists" };
        }

        const hashed = await bcrypt.hash(data.password, 10);

        const admin = await new Admin({
            ...data,
            password: hashed
        }).save();

        return {
            status: 201,
            message: "Admin created",
            data: admin
        };

    } catch (err) {
        return { status: 500, message: err.message };
    }
};


// ✅ Login Admin
const loginAdmin = async (data) => {
    try {
        const admin = await Admin.findOne({ email: data.email }).select("+password");

        if (!admin) {
            return { status: 404, message: "Admin not found" };
        }

        const isMatch = await bcrypt.compare(data.password, admin.password);

        if (!isMatch) {
            return { status: 401, message: "Invalid credentials" };
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role, name: admin.name },
            SECRET,
            { expiresIn: "1d" }
        );

        return {
            status: 200,
            message: "Login successful",
            data: {
                token,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            }
        };

    } catch (err) {
        return { status: 500, message: err.message };
    }
};

module.exports = {
    registerAdmin,
    loginAdmin
};