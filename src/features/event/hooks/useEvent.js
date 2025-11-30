import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getEventDetail, joinEvent } from "../api";
import { useCreateMutation } from "../../../core/queries/mutationHelpers";

export const useEvent = (slug) => {
    return useQuery({
        queryKey: ["eventDetail", slug],
        queryFn: () => getEventDetail(slug),
        placeholderData: keepPreviousData,
    });
}

export const useJoinEvent = () => {
    return useCreateMutation({
        mutationKey: ["joinEvent"],
        mutationFn: (eventId) => joinEvent(eventId),
    });
}