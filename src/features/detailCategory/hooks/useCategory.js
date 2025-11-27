import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDetailCategory } from "../api";

export const useCategory = (slug) => {
    return useQuery({
        queryKey: ["categoryDetail", slug],
        queryFn: () => getDetailCategory(slug),
        placeholderData: keepPreviousData,
    });
}