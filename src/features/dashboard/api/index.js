import api from "../../../core/api";

export const getCategories = async () => {
    const res = await api.get("/categories");
    return res;
}

export const getHighlights = async () => {
    const res = await api.get("/rooms/highlights");
    return res;
}

export const getPopular = async () => {
    const res = await api.get("/rooms/popular");
    return res;
}

export const getRegionRooms = async () => {
    const res = await api.get("/places/rooms");
    return res;
}
