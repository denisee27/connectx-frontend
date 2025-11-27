
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { useCities, useCountries } from "../../profiling/hooks/useProfiling";
import { useRegister } from "../hooks/useRegister";
import logger from "../../../core/utils/logger";

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
    countryId: z.string().min(1, "Country is required"),
    cityId: z.string().min(1, "City is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don\'t match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useCountries();
  const { data: cities, isLoading: isLoadingCities, isError: isErrorCities } = useCities(selectedCountry);
  const { mutateAsync: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");
    logger.info("Submitting registration form", data);
    try {
      const { fullName, ...rest } = data;
      await registerUser({ ...rest, name: fullName });
    } catch (err) {
      setServerError(err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="border border-secondary shadow-lg rounded-2xl p-8">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Create Your Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <p className="mb-4 text-center text-sm text-red-600">{serverError}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="John Doe"
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="example@connectx.com"
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  {...register("phoneNumber")}
                  type="tel"
                  placeholder="081234567890"
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Born Date</label>
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
                      className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  {...register("gender")}
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  {...register("occupation")}
                  type="text"
                  placeholder="Software Engineer"
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
                />
                {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select
                  {...register("countryId")}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color bg-white"
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
                {errors.countryId && <p className="mt-1 text-sm text-red-600">{errors.countryId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <select
                  {...register("cityId")}
                  disabled={!selectedCountry || isLoadingCities || isErrorCities}
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color bg-white disabled:bg-gray-100"
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
                {errors.cityId && <p className="mt-1 text-sm text-red-600">{errors.cityId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="********"
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="********"
                  className="px-2 mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-color focus:ring-primary-color"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-primary-color px-4 py-2 text-white cursor-pointer hover:bg-secondary bg-primary font-semibold hover:bg-primary-dark-color disabled:opacity-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="mt-4 text-sm text-center">
            <p>
              Already have an account?{" "}
              <Link to={"/login"} className="font-medium text-primary-color hover:text-primary-dark-color">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
