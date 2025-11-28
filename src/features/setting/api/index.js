import api from "../../../core/api";

// Send profile update using multipart/form-data to include binary photo
export const updateProfile = async (payload) => {
    const res = await api.upload("/profile/update", payload);
    return res;
}
