import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

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

export default API;