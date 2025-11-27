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