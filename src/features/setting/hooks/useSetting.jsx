import { keepPreviousData } from "@tanstack/react-query"
import { useCreateMutation } from "../../../core/queries/mutationHelpers"
import { updateProfile } from "../api"
import useUIStore from "../../../core/stores/uiStore";

export const useSetting = () => {
    const showSuccess = useUIStore((state) => state.showSuccess);
    return useCreateMutation({
        queryKey: ["settingKey"],
        mutationFn: (payload) => updateProfile(payload),
        showSuccessToast: false,
        onSuccess: () => {
            showSuccess("Changes saved successfully ✨");
        }
    })
}