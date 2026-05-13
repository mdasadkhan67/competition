const { getAllRegistrations, updatePaymentStatus, getStats, deleteRegistration } = require("../model/admin-data-model");

const getAllRegistrationsController = async (req, res) => {
    const result = await getAllRegistrations(req.query);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || []
    });
};

const updateStatusController = async (req, res) => {
    const result = await updatePaymentStatus(
        req.params.id,
        req.body
    );

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};


const getStatsController = async (req, res) => {
    const result = await getStats();

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const deleteRegistrationController = async (req, res) => {
    const result = await deleteRegistration(req.params.id);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message
    });
};

module.exports = {
    getAllRegistrationsController,
    updateStatusController,
    getStatsController,
    deleteRegistrationController
};