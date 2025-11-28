import { useQuery } from "@tanstack/react-query";
import { useCreateMutation } from "../../../core/queries/mutationHelpers";
import { createPayment, getPaymentStatus } from "../api";

export const useCreatePayment = () => {
  return useCreateMutation({
    queryKey: ["createPayment"],
    mutationFn: (payload) => createPayment(payload),
    showSuccessToast: false,
    showErrorToast: false,
    errorMessage: "Gagal membuat pembayaran",
  });
};

export const useStatusPayment = (orderId) => {
  return useQuery({
    queryKey: ["statusPayment", orderId],
    queryFn: () => getPaymentStatus(orderId),
    enabled: !!orderId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    showSuccessToast: false,
    showErrorToast: false,
    errorMessage: "Gagal mendapatkan status pembayaran",
  });
}
