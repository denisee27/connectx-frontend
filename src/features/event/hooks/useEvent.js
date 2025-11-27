import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getEventDetail } from "../api";

export const useEvent = (slug) => {
    return useQuery({
        queryKey: ["eventDetail", slug],
        queryFn: () => getEventDetail(slug),
        placeholderData: keepPreviousData,
    });
}