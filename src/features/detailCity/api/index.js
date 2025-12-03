import api from "../../../core/api";

export const getDetailCity = async (slug) => {
    const res = await api.get(`/places/city/${slug}`);
    console.log('res', res)
    return res
}