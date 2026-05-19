const mongoose = require("mongoose");

const lyricSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        group: {
            type: String,
            enum: ["Jr.", "Middle", "Sr"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate titles in the same group
lyricSchema.index({ title: 1, group: 1 }, { unique: true });

module.exports = mongoose.model("Lyric", lyricSchema);
