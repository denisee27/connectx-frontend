import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userPaymentStatus } from "../hooks/usePaymentStatus";
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("order_id");

    const { data: paymentData, isLoading } = userPaymentStatus(orderId, {
        refetchInterval: 4000,
        enabled: !!orderId,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/home");
        }, 60000); // 1 minute timeout

        return () => clearTimeout(timer);
    }, [navigate]);

    const status = paymentData?.data?.status || "PENDING";

    const handleCheck = () => {
        navigate("/home/schedule");
    };

    const renderContent = () => {
        if (isLoading && !paymentData) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p className="mt-4 text-lg font-medium text-gray-600">Checking payment status...</p>
                </div>
            );
        }

        switch (status) {
            case "PAID":
            case "SETTLED":
                return (
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">Payment Successful!</h2>
                        <p className="mb-8 text-gray-600">
                            Your payment has been processed successfully. You are all set!
                        </p>
                        <button
                            onClick={handleCheck}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-secondary hover:shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Check Schedule <ArrowRight size={18} />
                        </button>
                    </div>
                );
            case "PENDING":
                return (
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                            <Clock className="h-12 w-12 text-orange-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">Payment Pending</h2>
                        <p className="mb-8 text-gray-600">
                            We are waiting for the payment confirmation. Please wait a moment...
                        </p>
                        <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    </div>
                );
            case "EXPIRED":
            case "CANCELED":
            case "FAILED":
                return (
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                            <XCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">Payment Failed</h2>
                        <p className="mb-8 text-gray-600">
                            {status === "EXPIRED"
                                ? "Your payment session has expired."
                                : "Something went wrong with your payment."}
                            <br /> Please try again.
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                        >
                            Back to Home
                        </button>
                    </div>
                );
            default:
                return (
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <AlertCircle className="h-12 w-12 text-gray-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">Unknown Status</h2>
                        <p className="mb-8 text-gray-600">
                            We couldn't determine the status of your payment.
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Back to Home
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
                    {renderContent()}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Transaction ID: <span className="font-mono text-gray-500">{orderId || "N/A"}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
