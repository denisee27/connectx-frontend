import api from "../../../core/api";

export const updateProfile = async (payload) => {
    const res = await api.post("/profile/update", payload);
    return res;
}
