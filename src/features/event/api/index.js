import api from "../../../core/api";

export const getEventDetail = async (slug) => {
    console.log(slug);
    const res = await api.get("/rooms/" + slug);
    return res;
}