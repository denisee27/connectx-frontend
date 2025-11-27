import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getCities, getCountries, getQuestions, postProfilling } from "../api"
import { useCreateMutation } from "../../../core/queries/mutationHelpers"

export const useQuestions = () => {
    return useQuery({
        queryKey: ["questionsKey"],
        queryFn: () => getQuestions(),
        placeholderData: keepPreviousData,
        showSuccessToast: true,
    })
}

export const useCountries = () => {
    return useQuery({
        queryKey: ["countriesKey"],
        queryFn: () => getCountries(),
        placeholderData: keepPreviousData,
        showSuccessToast: true,
    })
}

export const useCities = (countryId) => {
    return useQuery({
        queryKey: ["cities", countryId],
        queryFn: () => getCities(countryId),
        enabled: !!countryId,
    });
}

export const useProfilling = () => {
    return useCreateMutation({
        queryKey: ["createProfiling"],
        showSuccessToast: false,
        mutationFn: ({ data }) => postProfilling(data),
    })
}

