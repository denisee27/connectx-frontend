import { useCreateMutation } from "../../../core/queries/mutationHelpers";
import { createRoom, getSessionChat, sendMessage, updateBankProfile } from "../api/api";

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

export const useCreateRoom = () => {
    return useCreateMutation({
        queryKey: ["createRoom"],
        mutationFn: (roomData) => createRoom(roomData),
        showSuccessToast: true,
    });
}

export const useUpdateBankProfile = () => {
    return useCreateMutation({
        queryKey: ["updateBankProfile"],
        mutationFn: (data) => updateBankProfile(data),
        showSuccessToast: true,
    });
}

