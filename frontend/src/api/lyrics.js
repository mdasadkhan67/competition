import API from './admin';

export const addLyric = async (title, group) => {
    try {
        const response = await API.post('/admin/lyrics', { title, group });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to add lyric';
    }
};

export const getLyrics = async (group = '') => {
    try {
        const url = group ? `/admin/lyrics?group=${group}` : '/admin/lyrics';
        const response = await API.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch lyrics';
    }
};

export const deleteLyric = async (id) => {
    try {
        const response = await API.delete(`/admin/lyrics/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete lyric';
    }
};
