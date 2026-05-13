import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Interceptor to add token
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const getGroupAvailability = async () => {
    const res = await API.get("/config/availability");
    return res.data;
};

export const updateGroupLimit = async (group, limit) => {
    const res = await API.put("/admin/config/limit", { group, limit });
    return res.data;
};

export const getGlobalConfig = async () => {
    const res = await API.get("/admin/config/global");
    return res.data;
};

export const updateGlobalConfig = async (startDate, endDate) => {
    const res = await API.put("/admin/config/update/global", { startDate, endDate });
    return res.data;
};
