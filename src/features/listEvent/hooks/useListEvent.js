import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllCategories, getAllEvent, getCountries } from "../api";

export const useListEvent = (filters = {}, options = {}) => {
    const { page = 1, limit = 10, title = '', categories = [], sort = 'datetime_asc', country = '' } = filters;
    return useQuery({
        queryKey: ["listEventKey", page, limit, title, categories, sort, country],
        queryFn: () => getAllEvent({ page, limit, title, categories, sort, country }),
        placeholderData: keepPreviousData,
        ...options,
    });
}

export const useCategories = () => {
    return useQuery({
        queryKey: ['categoriesKey'],
        queryFn: () => getAllCategories(),
        placeholderData: keepPreviousData,
    });
};

export const useCountries = (options = {}) => {
    return useQuery({
        queryKey: ["countriesKey"],
        queryFn: () => getCountries(),
        ...options,
    });
}

