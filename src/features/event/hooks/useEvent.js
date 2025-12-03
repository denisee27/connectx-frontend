import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventDetail, joinEvent } from "../api";
import { useCreateMutation } from "../../../core/queries/mutationHelpers";

export const useEvent = (slug) => {
    return useQuery({
        queryKey: ["eventDetail", slug],
        queryFn: () => getEventDetail(slug),
    });
}

export const useJoinEvent = () => {
    const queryClient = useQueryClient();
    return useCreateMutation({
        mutationKey: ["joinEvent"],
        mutationFn: (eventId) => joinEvent(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["eventDetail"] });
            queryClient.invalidateQueries({ queryKey: ["upcomingEventKey"] });
        }
    });
}