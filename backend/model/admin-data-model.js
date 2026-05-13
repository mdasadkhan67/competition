const Registration = require("../schema/registration-schema");

const getAllRegistrations = async (query) => {
    try {
        let filter = {};

        // ✅ Filter by group
        if (query.group) {
            filter.group = query.group;
        }

        // ✅ Search (optional)
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
                { phone: { $regex: query.search, $options: "i" } }
            ];
        }

        const data = await Registration.find(filter)
            .sort({ createdAt: -1 });

        return {
            status: 200,
            message: "Data fetched successfully",
            data
        };

    } catch (err) {
        return {
            status: 500,
            message: err.message
        };
    }
};

const updatePaymentStatus = async (id, body) => {
    try {
        const { status, reason } = body;

        if (!["approved", "rejected"].includes(status)) {
            return {
                status: 400,
                message: "Invalid payment status"
            };
        }

        const update = {
            "payment.status": status,
            registrationStatus: status,
            reason: status === "rejected" ? reason : ""
        };

        const data = await Registration.findByIdAndUpdate(
            id,
            update,
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
            message: "Payment status updated successfully",
            data
        };

    } catch (error) {
        return {
            status: 500,
            message: error.message
        };
    }
};

const getStats = async () => {
    try {
        const total = await Registration.countDocuments();

        const jr = await Registration.countDocuments({ group: "Jr." });
        const middle = await Registration.countDocuments({ group: "Middle" });
        const sr = await Registration.countDocuments({ group: "Sr" });

        const pending = await Registration.countDocuments({
            registrationStatus: "pending"
        });

        return {
            status: 200,
            data: {
                total,
                jr,
                middle,
                sr,
                pending
            }
        };

    } catch (err) {
        return { status: 500, message: err.message };
    }
};

const deleteRegistration = async (id) => {
    try {
        const data = await Registration.findByIdAndDelete(id);

        if (!data) {
            return {
                status: 404,
                message: "Registration not found"
            };
        }

        return {
            status: 200,
            message: "Registration deleted successfully"
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message
        };
    }
};

module.exports = {
    getAllRegistrations,
    updatePaymentStatus,
    getStats,
    deleteRegistration
};