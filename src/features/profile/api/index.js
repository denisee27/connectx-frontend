import api from "../../../core/api";

export const getProfile = async () => {
    const res = await api.get("/profile");
    return res.data;
}

export const updateBankProfile = async (data) => {
    const res = await api.put(`/profile/update-bank`, data);
    return res;
}