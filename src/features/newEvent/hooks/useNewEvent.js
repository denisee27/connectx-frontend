import { useCreateMutation } from "../../../core/queries/mutationHelpers";
import { getSessionChat, sendMessage } from "../api/api";

export const useGetSessionChat = () => {
    return useCreateMutation({
        queryKey: ["getSessionChat"],
        mutationFn: () => getSessionChat(),
        showSuccessToast: false,
    });
}

export const useSendMessage = () => {
    return useCreateMutation({
        queryKey: ["sendMessage"],
        showSuccessToast: false,
        mutationFn: ({ data, sessionId }) => sendMessage(data, sessionId),
    });
}

