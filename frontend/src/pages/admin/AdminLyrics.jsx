import { useState, useEffect } from "react";
import { addLyric, getLyrics, deleteLyric } from "../../api/lyrics";

export default function AdminLyrics() {
    const [title, setTitle] = useState("");
    const [group, setGroup] = useState("");
    const [lyrics, setLyrics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLyrics = async () => {
        try {
            setLoading(true);
            const res = await getLyrics();
            if (res.success) {
                setLyrics(res.data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLyrics();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !group) {
            alert("Please enter a title and select a group");
            return;
        }

        try {
            setLoading(true);
            await addLyric(title.trim(), group);
            setTitle("");
            fetchLyrics();
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this title?")) return;
        
        try {
            setLoading(true);
            await deleteLyric(id);
            fetchLyrics();
        } catch (err) {
            alert(err);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Set Final Round Lyrics</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Lyric Title</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="E.g., Hasbi Rabbi Jallallah"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
                        <select
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">-- Choose Group --</option>
                            <option value="Jr.">Jr.</option>
                            <option value="Middle">Middle</option>
                            <option value="Sr">Sr</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 h-[42px]"
                    >
                        {loading ? "Saving..." : "Add Title"}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Current Titles</h2>
                
                {error && <div className="text-red-500 mb-4">{error}</div>}
                
                {lyrics.length === 0 && !loading ? (
                    <div className="text-center text-gray-500 py-8">No titles added yet.</div>
                ) : (
                    <div className="grid gap-4">
                        {["Jr.", "Middle", "Sr"].map(grp => {
                            const groupLyrics = lyrics.filter(l => l.group === grp);
                            if (groupLyrics.length === 0) return null;
                            
                            return (
                                <div key={grp} className="mb-6 last:mb-0">
                                    <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-3">{grp} Group</h3>
                                    <ul className="space-y-2">
                                        {groupLyrics.map((lyric, idx) => (
                                            <li key={lyric._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-400 w-6">{idx + 1}.</span>
                                                    <span className="text-gray-800 font-medium">{lyric.title}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(lyric._id)}
                                                    className="text-red-500 hover:text-red-700 px-3 py-1 bg-red-50 rounded hover:bg-red-100 transition text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
