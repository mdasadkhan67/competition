const { addLyric, getLyrics, deleteLyric } = require("../model/lyric-model");

const addLyricController = async (req, res) => {
    const { title, group } = req.body;
    const result = await addLyric(title, group);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

const getLyricsController = async (req, res) => {
    const { group } = req.query; // optional
    const result = await getLyrics(group);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || []
    });
};

const deleteLyricController = async (req, res) => {
    const { id } = req.params;
    const result = await deleteLyric(id);

    return res.status(result.status).json({
        success: result.status < 400,
        message: result.message,
        data: result.data || {}
    });
};

module.exports = {
    addLyricController,
    getLyricsController,
    deleteLyricController
};
