const { createRegistration } = require('../model/registration-model');
const fs = require('fs');

const deleteFiles = (files) => {
    if (!files) return;

    Object.values(files).forEach(arr => {
        arr.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
    });
};

const createRegistrationController = async (req, res) => {
    try {
        const requiredFiles = {
            photo: "Photo is required",
            proof: "Document is required",
            transactionProof: "Transaction proof is required"
        };

        for (let key in requiredFiles) {
            if (!req.files || !req.files[key]) {
                deleteFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: requiredFiles[key]
                });
            }
        }

        const payment = req.body.payment;

        if (!payment || !payment.transactionId || !payment.amount) {
            deleteFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Payment transactionId and amount are required"
            });
        }

        const parsedAmount = Number(payment.amount);

        if (isNaN(parsedAmount)) {
            deleteFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Payment amount must be a number"
            });
        }

        const data = {
            ...req.body,

            payment: {
                transactionId: payment.transactionId,
                amount: parsedAmount
            },

            photo: req.files.photo[0].path.replace('uploads/', ''),
            proof: req.files.proof[0].path.replace('uploads/', ''),
            transactionProof: req.files.transactionProof[0].path.replace('uploads/', '')
        };

        delete data['payment[transactionId]'];
        delete data['payment[amount]'];

        const result = await createRegistration(data);

        if (result.status >= 400) {
            deleteFiles(req.files);
        }

        return res.status(result.status).json({
            success: result.status < 400,
            message: result.message,
            errors: result.errors || [],
            data: result.data || {}
        });

    } catch (error) {
        console.error("Registration Error:", error);

        deleteFiles(req.files);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

module.exports = {
    createRegistrationController
};