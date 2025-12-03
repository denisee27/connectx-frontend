import api from "../../../core/api";

export const getSessionChat = async () => {
    const res = await api.post(`/conversations`);
    return res;
}

export const sendMessage = async (message, sessionId) => {
    const res = await api.post(`/conversations/${sessionId}`, {
        message,
    });
    return res;
}

export const createRoom = async (roomData) => {
    const isFormData = typeof FormData !== 'undefined' && roomData instanceof FormData;
    const headers = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await api.post(`/rooms/create`, roomData, headers);
    return res;
}

export const updateBankProfile = async (data) => {
    const res = await api.put(`/profile/update-bank`, data);
    console.log("res", res);
return res;
}
