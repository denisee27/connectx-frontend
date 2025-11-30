import api from "../../../core/api";

export const getEventDetail = async (slug) => {
  const res = await api.get("/rooms/" + slug);
  return res;
};

export const createPayment = async (payload) => {
  const res = await api.post("/payments", payload);
  return res;
};

export const getPaymentStatus = async (orderId) => {
  const res = await api.get(`/payments/${orderId}/status`);
  return res;
};

export const joinEvent = async (eventId) => {
  const res = await api.post(`/rooms/${eventId}/join`);
  return res;
};
