import api from "../../../core/api";

export const getUpcomingEvent = async () => {
    const res = await api.get(`/schedules/upcoming`);
    return res;
}

export const getPastEvent = async () => {
    const res = await api.get(`/schedules/past`);
    return res;
}