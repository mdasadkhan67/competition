const Registration = require('../schema/registration-schema');
const Config = require('../schema/config-schema');
const Joi = require('joi');


const GlobalConfig = require('../schema/global-config-schema');

const createRegistration = async (data) => {

    // ✅ Global Config Check (Date Window)
    try {
        let globalConfig = await GlobalConfig.findOne();
        const now = new Date();
        if (globalConfig) {
            if (globalConfig.startDate && now < new Date(globalConfig.startDate)) {
                return {
                    status: 403,
                    message: "Registration is not open yet."
                };
            }
            if (globalConfig.endDate && now > new Date(globalConfig.endDate)) {
                return {
                    status: 403,
                    message: "Registration has been closed."
                };
            }
        }

        // Also check if all groups are full (Global check)
        // Note: Individual group check happens later in the code
    } catch (err) {
        console.error("Global Config Date Check Error", err);
    }

    // ✅ Joi Schema
    const validationSchema = Joi.object({
        name: Joi.string().min(2).trim().required(),

        email: Joi.string().email().lowercase().trim().required(),

        phone: Joi.string().pattern(/^[0-9]{10}$/).required(),

        alternatePhone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .allow('', null),

        dob: Joi.date().required(),

        address: Joi.string().trim().required(),

        city: Joi.string().trim().required(),

        state: Joi.string().trim().required(),

        zip: Joi.string()
            .pattern(/^[0-9]{6}$/) // ✅ Indian PIN code
            .required(),

        aadharNumber: Joi.string()
            .pattern(/^[0-9]{12}$/)
            .required(),

        naatTitle: Joi.string().trim().required(),

        group: Joi.string()
            .valid('Jr.', 'Middle', 'Sr')
            .required(),

        photo: Joi.string().trim().required(),

        proof: Joi.string().trim().required(),

        transactionProof: Joi.string().trim().required(),

        payment: Joi.object({
            transactionId: Joi.string().trim().required(),
            amount: Joi.number().min(1).required()
        }).required(),
    });

    // ✅ 1. Joi Validation (SYNC)
    let joiValidate = validationSchema.validate(data, {
        abortEarly: false
    });

    if (joiValidate.error) {
        return {
            status: 400,
            message: "Validation failed",
            errors: joiValidate.error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        };
    }

    try {
        // ✅ 2. Email Check
        let emailData = await Registration.findOne({ email: data.email });
        if (emailData) {
            return {
                status: 409,
                message: "Email already exists",
            };
        }

        // ✅ 3. Aadhar Check
        let aadharData = await Registration.findOne({ aadharNumber: data.aadharNumber }).select('+aadharNumber');
        if (aadharData) {
            return {
                status: 409,
                message: "Aadhar already exists",
            };
        }

        // ✅ 4. Group Limit Check
        let config = await Config.findOne({ group: data.group });
        if (config && config.limit > 0) {
            let count = await Registration.countDocuments({ group: data.group, registrationStatus: { $ne: 'rejected' } });
            if (count >= config.limit) {
                return {
                    status: 403,
                    message: `Registration for ${data.group} group is full. Limit of ${config.limit} exceeded.`,
                };
            }
        }

        // ✅ 5. Save Data
        let savedUser = await new Registration(data).save();
        return {
            status: 201,
            message: "Registration created successfully",
            data: savedUser,
        };

    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error",
        };
    }
};


module.exports = {
    createRegistration,
};