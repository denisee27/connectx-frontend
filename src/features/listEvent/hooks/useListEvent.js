import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllEvent } from "../api";

export const useListEvent = (filters = {}, options = {}) => {
    const { page = 1, limit = 10 } = filters;
    return useQuery({
        queryKey: ["listEventKey", page, limit],
        queryFn: () => getAllEvent({ page, limit }),
        placeholderData: keepPreviousData,
        ...options,
    });
}