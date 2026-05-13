const mongoose = require("mongoose");

const globalConfigSchema = new mongoose.Schema(
    {
        startDate: {
            type: Date,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("GlobalConfig", globalConfigSchema);
