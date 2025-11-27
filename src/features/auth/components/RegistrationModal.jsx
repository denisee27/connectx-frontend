
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities, useCountries } from "../../profiling/hooks/useProfiling";
import { useAuthStore } from "../stores/authStore";
import api from "../../../core/api";

const registrationSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    bornDate: z.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date format",
    }),
    gender: z.string().min(1, "Gender is required"),
    occupation: z.string().min(2, "Occupation is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegistrationModal({ isOpen, onClose }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useCountries();
  const { data: cities, isLoading: isLoadingCities, isError: isErrorCities } = useCities(selectedCountry);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { fullName, ...rest } = data;
      const response = await api.post("/auth/register", { ...rest, name: fullName });
      setAuth(response.data);
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error display to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white shadow-md rounded-2xl p-6 sm:p-8 my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Register</h1>
          <p className="text-gray-500">Create an account to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full rounded-xl border ${errors.fullName ? "border-red-500" : "border-gray-200"} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                {...register("fullName")}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                placeholder="example@connectx.com"
                className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                placeholder="081234567890"
                className={`w-full rounded-xl border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Born Date *</label>
              <Controller
                control={control}
                name="bornDate"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="DD/MM/YYYY"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    dateFormat="dd/MM/yyyy"
                    wrapperClassName="w-full"
                    className={`w-full rounded-xl border ${errors.bornDate ? 'border-red-500' : 'border-gray-200'} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    minDate={new Date("1940-01-01")}
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                  />
                )}
              />
              {errors.bornDate && <p className="mt-1 text-sm text-red-600">{errors.bornDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                className={`w-full rounded-xl border ${errors.gender ? 'border-red-500' : 'border-gray-200'} px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
                {...register("gender")}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                placeholder="********"
                className={`w-full rounded-xl border ${errors.password ? "border-red-500" : "border-gray-200"} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                type="password"
                placeholder="********"
                className={`w-full rounded-xl border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
            <input
              type="text"
              placeholder="Software Engineer"
              className={`w-full rounded-xl border ${errors.occupation ? 'border-red-500' : 'border-gray-200'} px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400`}
              {...register("occupation")}
            />
            {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <select
                {...register("country")}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className={`w-full rounded-xl border ${errors.country ? 'border-red-500' : 'border-gray-200'} px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400`}
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
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <select
                {...register("city")}
                disabled={!selectedCountry || isLoadingCities || isErrorCities}
                className={`w-full rounded-xl border ${errors.city ? 'border-red-500' : 'border-gray-200'} px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100`}
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
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>
          </div>

          <div className="gap-2 flex flex-col pt-2">
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
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
