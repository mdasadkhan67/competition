const Registration = require('../schema/registration-schema');
const Lyric = require('../schema/lyric-schema');

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

        let availableNaats = [];
        if (data.isRound2Selected) {
            const lyrics = await Lyric.find({ group: data.group });
            availableNaats = lyrics.map(l => l.title);
        }

        return {
            status: 200,
            message: "Status fetched successfully",
            data: {
                candidateRegId: data.candidateRegId,
                registrationStatus: data.registrationStatus,
                reason: data.reason || "",
                paymentStatus: data.payment?.status || "pending",
                isRound2Selected: data.isRound2Selected,
                isRound1Rejected: data.isRound1Rejected,
                finalRoundNaat: data.finalRoundNaat,
                group: data.group,
                availableNaats
            }
        };

    } catch (error) {
        console.error("getRegistrationStatus error:", error);
        return {
            status: 500,
            message: "Unable to fetch registration status. Please try again later."
        };
    }
};

const submitFinalNaat = async (regId, naatTitle) => {
    try {
        const data = await Registration.findOneAndUpdate(
            { candidateRegId: regId },
            { finalRoundNaat: naatTitle },
            { new: true }
        );

        if (!data) {
            return {
                status: 404,
                message: "Registration not found"
            };
        }

        return {
            status: 200,
            message: "Final Round Naat successfully submitted",
            data: {
                candidateRegId: data.candidateRegId,
                finalRoundNaat: data.finalRoundNaat
            }
        };
    } catch (error) {
        console.error("submitFinalNaat error:", error);
        return {
            status: 500,
            message: "Unable to save your selection. Please try again later."
        };
    }
};

module.exports = {
    getRegistrationStatus,
    submitFinalNaat
};