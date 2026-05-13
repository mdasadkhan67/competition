const Config = require('../schema/config-schema');
const GlobalConfig = require('../schema/global-config-schema');
const Registration = require('../schema/registration-schema');

const getGroupAvailability = async () => {
    try {
        const groups = ["Jr.", "Middle", "Sr"];
        const availability = [];

        for (let group of groups) {
            let config = await Config.findOne({ group });
            let limit = config ? config.limit : 0; // If no config, assume limit is 0 (closed) or we can default to 100? Let's say 0. Wait, better to just create default configs if they don't exist.

            if (!config) {
                // Create default config with large limit or 0? Let's use 0 so admin has to set it.
                config = await new Config({ group, limit: 100 }).save();
                limit = 100;
            }

            const count = await Registration.countDocuments({ group, registrationStatus: { $ne: 'rejected' } });

            availability.push({
                group,
                limit,
                count,
                isFull: count >= limit
            });
        }

        const globalConfig = await GlobalConfig.findOne() || {};
        const now = new Date();
        let registrationOpen = true;
        let registrationMessage = "";

        if (globalConfig.startDate && now < new Date(globalConfig.startDate)) {
            registrationOpen = false;
            registrationMessage = "Registration is not open yet.";
        } else if (globalConfig.endDate && now > new Date(globalConfig.endDate)) {
            registrationOpen = false;
            registrationMessage = "Registration has been closed.";
        }

        // Also check if all groups are full
        const allFull = availability.length > 0 && availability.every(item => item.isFull);
        if (registrationOpen && allFull) {
            registrationOpen = false;
            registrationMessage = "All registration slots are full.";
        }

        return {
            status: 200,
            message: "Availability fetched successfully",
            data: availability,
            globalConfig: {
                startDate: globalConfig.startDate || null,
                endDate: globalConfig.endDate || null,
                isOpen: registrationOpen,
                message: registrationMessage
            }
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

const updateGroupLimit = async (group, limit) => {
    try {
        const updatedConfig = await Config.findOneAndUpdate(
            { group },
            { limit },
            { new: true, upsert: true, returnDocument: 'after' }
        );

        return {
            status: 200,
            message: "Group limit updated successfully",
            data: updatedConfig
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

const getGlobalConfig = async () => {
    try {
        let config = await GlobalConfig.findOne();
        if (!config) {
            config = await new GlobalConfig({}).save();
        }
        return {
            status: 200,
            message: "Global config fetched successfully",
            data: config
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

const updateGlobalConfig = async (startDate, endDate) => {
    try {
        let config = await GlobalConfig.findOne();
        if (!config) {
            config = new GlobalConfig({});
        }

        if (startDate !== undefined) config.startDate = startDate;
        if (endDate !== undefined) config.endDate = endDate;

        const updatedConfig = await config.save();

        return {
            status: 200,
            message: "Global config updated successfully",
            data: updatedConfig
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

module.exports = {
    getGroupAvailability,
    updateGroupLimit,
    getGlobalConfig,
    updateGlobalConfig
};
