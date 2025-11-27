import api from "../../../core/api";

export const getDetailCategory = async (slug) => {
    const res = await api.get("/categories/" + slug);
    return res;
};