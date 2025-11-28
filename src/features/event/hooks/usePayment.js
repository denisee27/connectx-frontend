import { useCreateMutation } from "../../../core/queries/mutationHelpers";
import { createPayment } from "../api";

export const useCreatePayment = () => {
  return useCreateMutation({
    queryKey: ["createPayment"],
    mutationFn: (payload) => createPayment(payload),
    showSuccessToast: false,
    showErrorToast: false,
    errorMessage: "Gagal membuat pembayaran",
  });
};
