import api from "../../../core/api";

export const getSessionChat = async () => {
    const res = await api.post(`/conversations`);
    console.log("res", res);
    return res;
}

export const sendMessage = async (message, sessionId) => {
    const res = await api.post(`/conversations/${sessionId}`, {
        message,
    });
    console.log("res", res);
    return res;
}

export const createRoom = async (roomData) => {
    const isFormData = typeof FormData !== 'undefined' && roomData instanceof FormData;
    const headers = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await api.post(`/rooms/create`, roomData, headers);
    console.log("res", res);
    return res;
}
