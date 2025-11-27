import api from "../../../core/api";

export const getAllEvent = async ({ limit = 10, page = 1 }) => {
    const res = await api.getPaginated(`/rooms?limit=${limit}&page=${page}`);
    console.log("res", res);
    return res;
}