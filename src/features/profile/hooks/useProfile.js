import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProfile } from "../api";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profileKey"],
        queryFn: () => getProfile(),
        placeholderData: keepPreviousData,
    });
}