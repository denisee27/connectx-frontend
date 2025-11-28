import { keepPreviousData } from "@tanstack/react-query"
import { useCreateMutation } from "../../../core/queries/mutationHelpers"
import { updateProfile } from "../api"

export const useSetting = () => {
    return useCreateMutation({
        queryKey: ["settingKey"],
        mutationFn: (payload) => updateProfile(payload),
    })
}