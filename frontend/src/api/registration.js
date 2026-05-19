import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // ✅ FIX PORT
});

// 👉 Register API
export const registerUser = async (form, files) => {
    const fd = new FormData();

    // ✅ Append normal fields
    Object.keys(form).forEach((key) => {
        if (
            key !== "transactionId" &&
            key !== "amount"
        ) {
            fd.append(key, form[key]);
        }
    });

    fd.append("payment[transactionId]", form.transactionId);
    fd.append("payment[amount]", form.amount);

    // ✅ Append files (only if exist)
    if (files.photo) fd.append("photo", files.photo);
    if (files.proof) fd.append("proof", files.proof);
    if (files.transactionProof)
        fd.append("transactionProof", files.transactionProof);

    const res = await API.post("/register", fd);

    return res.data;
};

export const checkStatus = async (regId) => {
    const res = await API.get(`/status/${regId}`);
    return res.data;
};

export const submitFinalNaat = async (regId, naatTitle) => {
    const res = await API.put(`/status/${regId}/naat`, { naatTitle });
    return res.data;
};