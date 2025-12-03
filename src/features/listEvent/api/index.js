import api from "../../../core/api";

export const getAllEvent = async ({ page = 1, limit = 10, title = '', categories = '', sort = 'datetime_asc', country = '', paymentType = '' }) => {
    const params = new URLSearchParams({
        page,
        limit,
        sort,
    });

    if (title) {
        params.append('title', title);
    }
    if (categories) {
        params.append('categories', categories);
    }
    if (country) {
        params.append('country', country);
    }
    if (paymentType) {
        params.append('paymentType', paymentType);
    }

    const res = await api.getPaginated(`/rooms?${params.toString()}`);
    return res;
}

export const getAllCategories = async () => {
    const res = await api.get('/categories');
    return res;
}

export const getCountries = async () => {
    const res = await api.get('/places/countries');
    return res;
}