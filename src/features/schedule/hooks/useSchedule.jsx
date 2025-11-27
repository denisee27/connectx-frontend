import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPastEvent, getUpcomingEvent } from "../api";

export const useUpcomingEvent = (options = {}) => {
    return useQuery({
        queryKey: ["upcomingEventKey"],
        queryFn: () => getUpcomingEvent(),
        placeholderData: keepPreviousData,
        ...options,
    });
}

export const usePastEvent = (options = {}) => {
    return useQuery({
        queryKey: ["pastEventKey"],
        queryFn: () => getPastEvent(),
        placeholderData: keepPreviousData,
        ...options,
    });
}