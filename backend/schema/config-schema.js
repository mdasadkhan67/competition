const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
    {
        group: {
            type: String,
            enum: ["Jr.", "Middle", "Sr"],
            required: true,
            unique: true
        },

        limit: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Config", configSchema);