const { getRegistrationStatus } = require('../model/status-model');

const getStatusController = async (req, res) => {
    const { regId } = req.params;

    const result = await getRegistrationStatus(regId);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

module.exports = {
    getStatusController
};