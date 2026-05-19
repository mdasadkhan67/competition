const { getRegistrationStatus, submitFinalNaat } = require('../model/status-model');

const getStatusController = async (req, res) => {
    const { regId } = req.params;

    const result = await getRegistrationStatus(regId);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const submitFinalNaatController = async (req, res) => {
    const { regId } = req.params;
    const { naatTitle } = req.body;

    if (!naatTitle) {
        return res.status(400).json({ success: false, message: "Naat title is required" });
    }

    const result = await submitFinalNaat(regId, naatTitle);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

module.exports = {
    getStatusController,
    submitFinalNaatController
};