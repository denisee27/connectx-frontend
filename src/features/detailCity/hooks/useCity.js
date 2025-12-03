export { keepPreviousData, useQuery } from "@tanstack/react-query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDetailCity } from "../api";

export const useCity = (slug) => {
    return useQuery({
        queryKey: ["cityDetail", slug],
        queryFn: () => getDetailCity(slug),
        placeholderData: keepPreviousData,
    });
}