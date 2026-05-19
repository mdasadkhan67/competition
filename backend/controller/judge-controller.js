const judgeModel = require("../model/judge-model");
const Registration = require("../schema/registration-schema");

const createJudgeController = async (req, res) => {
    const result = await judgeModel.createJudge(req.body);
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const getAllJudgesController = async (req, res) => {
    const result = await judgeModel.getAllJudges();
    return res.status(result.status).json({
        success: result.status < 400,
        data: result.data || []
    });
};

const updateJudgeController = async (req, res) => {
    const result = await judgeModel.updateJudge(req.params.id, req.body);
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const deleteJudgeController = async (req, res) => {
    const result = await judgeModel.deleteJudge(req.params.id);
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message
    });
};

const getJudgingRegistrationsController = async (req, res) => {
    try {
        // Only show approved registrations that are selected for Round 2
        const data = await Registration.find({ 
            registrationStatus: "approved",
            isRound2Selected: true 
        }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const submitScoreController = async (req, res) => {
    const { registrationId, cat1, cat2, cat3, cat4, cat5, totalScore, comments } = req.body;
    const judgeId = req.user.id;
    const judgeName = req.user.name;

    const result = await judgeModel.submitScore(judgeId, judgeName, registrationId, { cat1, cat2, cat3, cat4, cat5, totalScore, comments });
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

module.exports = {
    createJudgeController,
    getAllJudgesController,
    updateJudgeController,
    deleteJudgeController,
    getJudgingRegistrationsController,
    submitScoreController
};
