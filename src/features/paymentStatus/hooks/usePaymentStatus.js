import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "../api/api";

export const userPaymentStatus = (orderId, options = {}) => {
    return useQuery({
        queryKey: ["paymentStatus", orderId],
        queryFn: () => getPaymentStatus(orderId),
        placeholderData: keepPreviousData,
        ...options
    })
}