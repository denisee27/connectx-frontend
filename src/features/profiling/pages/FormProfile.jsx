import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { buildProfilingPayload } from "../utils/payload";
import { useModal } from "../../../core/stores/uiStore";
import { TriangleAlert } from "lucide-react";
import { resetProfilingAll, resetProfilingStorage, DEFAULT_PROFILE_VALUES } from "../utils/reset";
import { useCities, useCountries, useProfilling } from "../hooks/useProfiling";
import { useAuthStore } from "../../auth/stores/authStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    bornDate: z.date({
        required_error: "Date of birth is required",
        invalid_type_error: "Invalid date format",
    }),
    gender: z.string().min(1, "Gender is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    occupation: z.string().min(2, "Occupation is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    email: z.string().email("Invalid email address"),
});

/**
 * @typedef {object} ProfillingResponse
 * @property {object} data
 * @property {string} data.accessToken
 * @property {Array<any>} data.rooms
 */

export default function FormProfile() {
    const navigate = useNavigate();
    const refreshModal = useModal("profilingRefreshConfirm");
    const [selectedCountry, setSelectedCountry] = useState("");
    const { mutateAsync: postProfiling } = useProfilling();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);

    const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useCountries();
    const { data: cities, isLoading: isLoadingCities, isError: isErrorCities } = useCities(selectedCountry);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
        setValue,
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            bornDate: "",
            gender: "",
            city: "",
            country: "",
            occupation: "",
            phoneNumber: "",
            email: "",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        navigate("/profiling/suggestion", { state: { profileData: data } });
    };

    // Alert sebelum refresh dan tandai reload terkonfirmasi
    useEffect(() => {
        const onBeforeUnload = (e) => {
            const message = "Your changes have not been saved. Are you sure you want to reload the page?";
            e.preventDefault();
            e.returnValue = message;
            return message;
        };
        const onPageHide = () => {
            try {
                sessionStorage.setItem("profilingReloadConfirmed", "1");
                sessionStorage.setItem("profilingReloadOrigin", "form");
            } catch (_) { }
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("pagehide", onPageHide);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("pagehide", onPageHide);
        };
    }, []);

    // Saat reload terkonfirmasi, reset semua input dan kembali ke questioner
    useEffect(() => {
        try {
            const navigationEntries = performance.getEntriesByType?.("navigation") || [];
            const navType = navigationEntries[0]?.type || "navigate";
            const confirmed = sessionStorage.getItem("profilingReloadConfirmed") === "1";
            const origin = sessionStorage.getItem("profilingReloadOrigin");
            if (navType === "reload" && confirmed) {
                // Reset semua inputan dan storage
                reset(DEFAULT_PROFILE_VALUES);
                resetProfilingStorage();
                // Hapus flag
                try {
                    sessionStorage.removeItem("profilingReloadConfirmed");
                    sessionStorage.removeItem("profilingReloadOrigin");
                } catch (_) { }
                // Redirect ke questioner
                try {
                    navigate("/profiling/questioner", { replace: true });
                } catch (_) {
                    // Jika navigasi gagal, biarkan halaman tetap; tampilkan fallback via modal
                }
            }
        } catch (err) {
            // Jika terjadi error saat reset
            console.error("Reset saat reload gagal:", err);
        }
    }, [navigate, reset]);

    const confirmNo = () => {
        refreshModal.close();
    };

    const confirmYes = () => {
        sessionStorage.setItem("profilingSkipRefreshModal", "1");
        resetProfilingAll(reset);
        refreshModal.close();
        navigate("/profiling/questioner", { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Tell us about yourself</h1>
                    <p className="text-gray-500">Help us create your ConnectX profile</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input
                                type="text"
                                placeholder="example@connectx.com"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                            <input
                                type="text"
                                placeholder="081234567890"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register("phoneNumber")}
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Born Date *</label>
                            <Controller
                                control={control}
                                name="bornDate"
                                render={({ field }) => (
                                    <DatePicker
                                        // --- 1. Basic Settings ---
                                        placeholderText="DD/MM/YYYY"
                                        onChange={(date) => field.onChange(date)}
                                        // Logika aman anti-error "Invalid time value"
                                        selected={field.value && !isNaN(new Date(field.value).getTime()) ? new Date(field.value) : null}
                                        dateFormat="dd/MM/yyyy"

                                        // --- 2. Styling ---
                                        wrapperClassName="w-full"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"

                                        // --- 3. FITUR PILIH BULAN & TAHUN (Ini yang Anda cari) ---
                                        showMonthDropdown  // Munculkan dropdown Bulan (Januari - Desember)
                                        showYearDropdown   // Munculkan dropdown Tahun
                                        dropdownMode="select" // Tampilkan sebagai Select Box biasa (lebih rapi daripada scroll)

                                        // --- 4. Batasan Tanggal Lahir ---
                                        maxDate={new Date()} // Tidak boleh pilih tanggal masa depan
                                        minDate={new Date("1940-01-01")} // (Opsional) Batas paling tua
                                        yearDropdownItemNumber={100} // Agar tahunnya muncul banyak ke belakang (misal 100 tahun ke belakang)
                                        scrollableYearDropdown // Agar dropdown tahun bisa discroll panjang
                                    />
                                )}
                            />
                            {errors.bornDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.bornDate.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register("gender")}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.gender && (
                                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                            <select
                                {...register("country")}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option value="">Select a country</option>
                                {isLoadingCountries ? (
                                    <option>Loading...</option>
                                ) : isErrorCountries ? (
                                    <option>Error loading countries</option>
                                ) : (
                                    countries?.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {errors.country && (
                                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                            <select
                                {...register("city")}
                                disabled={!selectedCountry || isLoadingCities || isErrorCities}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                            >
                                <option value="">Select a city</option>
                                {isLoadingCities ? (
                                    <option>Loading...</option>
                                ) : isErrorCities ? (
                                    <option>Error loading cities</option>
                                ) : (
                                    cities?.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                        <input
                            type="text"
                            placeholder="Software Engineer"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register("occupation")}
                        />
                        {errors.occupation && (
                            <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>
                        )}
                    </div>
                    <div className="gap-2 flex flex-col">
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full hover:cursor-pointer rounded-full bg-primary hover:bg-secondary text-white font-semibold py-3 transition-colors disabled:opacity-60 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Continue"
                            )}
                        </button>
                    </div>
                </form>

                {refreshModal.isOpen && (
                    <div>
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" aria-hidden="true" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="profiling-refresh-title"
                            >
                                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 px-6 pt-8 pb-6 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                        <svg className="h-8 w-8 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <TriangleAlert />
                                        </svg>
                                    </div>
                                </div>
                                <div className="px-6 py-6">
                                    <h3 id="profiling-refresh-title" className="text-center text-lg font-semibold text-gray-900 mb-3">
                                        Konfirmasi Refresh
                                    </h3>
                                    <p className="text-center text-sm text-gray-600">
                                        Apakah Anda yakin ingin memulai ulang? Semua jawaban akan direset.
                                    </p>
                                    <div className="mt-6 flex items-center justify-center gap-3">
                                        <button
                                            id="profiling-refresh-yes-btn"
                                            onClick={confirmYes}
                                            className="rounded-full px-5 py-2.5 bg-orange-500 text-white font-semibold hover:bg-orange-600"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={confirmNo}
                                            className="rounded-full px-5 py-2.5 border border-gray-300 bg-white text-gray-700"
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    // <div>
                    //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" aria-hidden="true" />
                    //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    //         <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
                    //             <div className="p-6">
                    //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Refresh</h3>
                    //                 <p className="text-sm text-gray-600">Apakah Anda yakin ingin memulai ulang? Semua jawaban akan direset.</p>
                    //                 <div className="mt-6 flex justify-end gap-3">
                    //                     <button onClick={() => refreshModal.close()} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Tidak, tetap</button>
                    //                     <button onClick={() => {  }} className="px-4 py-2 rounded-lg bg-orange-500 text-white">Ya, mulai ulang</button>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>
                )}
            </div>
        </div>
    );
}