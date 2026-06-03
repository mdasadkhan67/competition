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

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const msg = error.response?.data?.message || "";

        if (status === 401 || status === 403 || msg.toLowerCase().includes("token") || msg.toLowerCase().includes("jwt")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("admin");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

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
