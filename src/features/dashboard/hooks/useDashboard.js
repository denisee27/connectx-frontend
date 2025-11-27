import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getCategories, getHighlights, getPopular, getRegionRooms } from "../api"

export const useCategories = () => {
    return useQuery({
        queryKey: ["categoriesKey"],
        queryFn: () => getCategories(),
        placeholderData: keepPreviousData,
    })
}

export const useHighlights = () => {
    return useQuery({
        queryKey: ["highlightsKey"],
        queryFn: () => getHighlights(),
        placeholderData: keepPreviousData,
    })
}

export const usePopular = () => {
    return useQuery({
        queryKey: ["popularKey"],
        queryFn: () => getPopular(),
        placeholderData: keepPreviousData,
    })
}

export const useRegionRooms = () => {
    return useQuery({
        queryKey: ["regionsKey"],
        queryFn: () => getRegionRooms(),
        placeholderData: keepPreviousData,
    })
}
