const { registerAdmin, loginAdmin } = require("../model/admin-model");

const registerAdminController = async (req, res) => {
    const result = await registerAdmin(req.body);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const loginAdminController = async (req, res) => {
    const result = await loginAdmin(req.body);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

module.exports = {
    registerAdminController,
    loginAdminController
};