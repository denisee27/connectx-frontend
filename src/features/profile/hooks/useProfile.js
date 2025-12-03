import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProfile, updateBankProfile } from "../api";
import { useCreateMutation } from "../../../core/queries/mutationHelpers";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profileKey"],
        queryFn: () => getProfile(),
        placeholderData: keepPreviousData,
    });
}

export const useUpdateBankProfile = () => {
    return useCreateMutation({
        queryKey: ["updateBankProfile"],
        mutationFn: (data) => updateBankProfile(data),
        invalidateKeys: [["profileKey"]],
        showSuccessToast: true,
        successMessage: "Bank information updated successfully!",
    });
}