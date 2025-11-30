import api from "../../../core/api";

export const getCategories = async () => {
    const res = await api.get("/categories");
    return res;
}

export const getHighlights = async (cityId) => {
    const res = await api.get(`/rooms/highlights?cityId=${cityId}`);
    return res;
}

export const getPopular = async (cityId) => {
    console.log(cityId)
    const res = await api.get(`/rooms/popular?cityId=${cityId}`);
    return res;
}

export const getRegionRooms = async () => {
    const res = await api.get("/places/rooms");
    return res;
}

export const getTemporaryUser = async (userId) => {
    const res = await api.get(`/profile/${userId}/temporary`);
    return res;
}
