import api from "../../../core/api";

export const getFind = async () => {
    const data = await api.get("/rooms?page=1&limit=4");
    return data;
};