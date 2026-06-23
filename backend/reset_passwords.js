const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Admin = require("./schema/admin-schema");

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        const hashed = await bcrypt.hash("123456", 10);

        await Admin.updateOne({ email: "admin@example.com" }, { $set: { password: hashed } });
        console.log("Updated admin@example.com password to '123456'");

        await Admin.updateOne({ email: "judge1@gmail.com" }, { $set: { password: hashed } });
        console.log("Updated judge1@gmail.com password to '123456'");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
