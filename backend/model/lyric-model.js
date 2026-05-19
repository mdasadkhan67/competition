const Lyric = require("../schema/lyric-schema");

const addLyric = async (title, group) => {
    try {
        if (!title || !group) {
            return { status: 400, message: "Title and group are required" };
        }

        const newLyric = await Lyric.create({ title, group });

        return {
            status: 201,
            message: "Lyric added successfully",
            data: newLyric
        };
    } catch (error) {
        if (error.code === 11000) {
            return { status: 400, message: "Lyric title already exists for this group" };
        }
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

const getLyrics = async (group) => {
    try {
        const query = group ? { group } : {};
        const lyrics = await Lyric.find(query).sort({ createdAt: -1 });

        return {
            status: 200,
            message: "Lyrics fetched successfully",
            data: lyrics
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

const deleteLyric = async (id) => {
    try {
        const deletedLyric = await Lyric.findByIdAndDelete(id);
        
        if (!deletedLyric) {
            return { status: 404, message: "Lyric not found" };
        }

        return {
            status: 200,
            message: "Lyric deleted successfully",
            data: deletedLyric
        };
    } catch (error) {
        return {
            status: 500,
            message: error.message || "Internal server error"
        };
    }
};

module.exports = {
    addLyric,
    getLyrics,
    deleteLyric
};
