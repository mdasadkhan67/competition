const { getAllRegistrations, updatePaymentStatus, getStats, deleteRegistration, toggleRoundSelection, rejectRound1, deleteRegistrationScore } = require("../model/admin-data-model");

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

const toggleRoundSelectionController = async (req, res) => {
    const { isSelected } = req.body;
    const result = await toggleRoundSelection(req.params.id, isSelected);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const rejectRound1Controller = async (req, res) => {
    const { reason } = req.body;
    const result = await rejectRound1(req.params.id, reason);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const deleteRegistrationScoreController = async (req, res) => {
    const { id, judgeId } = req.params;
    const result = await deleteRegistrationScore(id, judgeId);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

module.exports = {
    getAllRegistrationsController,
    updateStatusController,
    getStatsController,
    deleteRegistrationController,
    toggleRoundSelectionController,
    rejectRound1Controller,
    deleteRegistrationScoreController
};