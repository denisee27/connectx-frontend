import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFind } from "../api";

export const useFind = () => {
    return useQuery({
        queryKey: ["find"],
        queryFn: () => getFind(),
        placeholderData: keepPreviousData,
    });
}