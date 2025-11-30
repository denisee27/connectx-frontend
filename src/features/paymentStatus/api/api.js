import api from "../../../core/api";

export const getPaymentStatus = async (orderId) => {
    const res = await api.get("/payments/" + orderId + "/status");
    return res;
};
