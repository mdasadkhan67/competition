const Registration = require('../schema/registration-schema');

const getRegistrationStatus = async (regId) => {
    if (!regId) {
        return {
            status: 400,
            message: "Registration ID is required"
        };
    }

    try {
        const data = await Registration.findOne({
            candidateRegId: regId
        });

        if (!data) {
            return {
                status: 404,
                message: "Registration not found"
            };
        }

        return {
            status: 200,
            message: "Status fetched successfully",
            data: {
                candidateRegId: data.candidateRegId,
                registrationStatus: data.registrationStatus,
                reason: data.reason || "",
                paymentStatus: data.payment?.status || "pending"
            }
        };

    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

module.exports = {
    getRegistrationStatus
};