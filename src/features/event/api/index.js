import api from "../../../core/api";

export const getEventDetail = async (slug) => {
    console.log(slug);
    const res = await api.get("/rooms/" + slug);
    return res;
}

export const createPayment = async (payload) => {
    const res = await api.post("/payments", payload);
    return res;
}