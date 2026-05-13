const { getGroupAvailability, updateGroupLimit, getGlobalConfig, updateGlobalConfig } = require('../model/config-model');


const getGroupAvailabilityController = async (req, res) => {
    const result = await getGroupAvailability();
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || [],
        globalConfig: result.globalConfig || null
    });
};

const updateGroupLimitController = async (req, res) => {
    const { group, limit } = req.body;

    if (!group || limit === undefined) {
        return res.status(400).json({
            success: false,
            message: "Group and limit are required"
        });
    }

    const result = await updateGroupLimit(group, Number(limit));
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const getGlobalConfigController = async (req, res) => {
    const result = await getGlobalConfig();
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const updateGlobalConfigController = async (req, res) => {
    const { startDate, endDate } = req.body;

    const result = await updateGlobalConfig(startDate, endDate);
    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

module.exports = {
    getGroupAvailabilityController,
    updateGroupLimitController,
    getGlobalConfigController,
    updateGlobalConfigController
};
