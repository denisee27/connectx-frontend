import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getCategories, getHighlights, getPopular, getRegionRooms, getTemporaryUser } from "../api"

export const useCategories = () => {
    return useQuery({
        queryKey: ["categoriesKey"],
        queryFn: () => getCategories(),
        placeholderData: keepPreviousData,
    })
}

export const useHighlights = (cityId) => {
    return useQuery({
        queryKey: ["highlightsKey", cityId],
        queryFn: () => getHighlights(cityId),
        placeholderData: keepPreviousData,
    })
}

export const usePopular = (cityId) => {
    return useQuery({
        queryKey: ["popularKey", cityId],
        queryFn: () => getPopular(cityId),
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

export const useTemporaryUser = (userId, isAuthenticated) => {
    console.log('userId', userId);
    console.log('isAuthenticated', isAuthenticated);
    return useQuery({
        queryKey: ["temporaryUserKey", userId],
        queryFn: () => getTemporaryUser(userId),
        placeholderData: keepPreviousData,
        enabled: (isAuthenticated === false && userId != null),
    })
}
