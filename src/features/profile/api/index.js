import api from "../../../core/api";

export const getProfile = async () => {
    const res = await api.get("/profile");
    return res.data;
}