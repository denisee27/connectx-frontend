import React, { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Upload, User, X } from "lucide-react";
import { useProfile } from "../../profile/hooks/useProfile";
import { env } from "../../../core/config/env.js";
import { useUpdateUser, useUploadUserAvatar } from "../../users/hooks/useUserMutations.js";
import { useCities, useCountries } from "../../profiling/hooks/useProfiling";
import { useSetting } from "../hooks/useSetting.jsx";

/**
 * Setting Page – Update Profil
 * - Form data profil dasar: nama, email, telepon, alamat
 * - Password saat ini → memunculkan Password baru + Konfirmasi (dengan toggle visibility)
 * - Validasi input dan feedback yang jelas
 * - Animasi transisi halus saat menampilkan/menyembunyikan section password tambahan
 * - Styling mengikuti theme kelas yang sudah digunakan di project
 */
export const Setting = () => {
    const { data: userData, isPending } = useProfile();
    console.log("userData", userData);
    // Foto profil
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    // Data profil
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [countryId, setCountryId] = useState("");
    const [cityId, setCityId] = useState("");
    const [bornDate, setBornDate] = useState("");
    const [preferences, setPreferences] = useState([]);
    const [prefInput, setPrefInput] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");

    const { data: countries = [], isLoading: isLoadingCountries } = useCountries();
    const { data: cities, isLoading: isLoadingCities, isError: isErrorCities } = useCities(selectedCountry);
    const citires = cities;

    // Password
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Toggle visibility
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Validasi & feedback
    const [errors, setErrors] = useState({});
    const [feedback, setFeedback] = useState({ type: "", message: "" });
    const { mutateAsync: updateProfile, isPending: isPendingUpdateProfile } = useSetting();
    const fileInputRef = useRef(null);

    const updateUser = useUpdateUser();
    const uploadAvatar = useUploadUserAvatar();

    const passwordSectionVisible = currentPassword.length > 0;

    const acceptTypes = useMemo(() => ["image/jpeg", "image/png"], []);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!acceptTypes.includes(file.type)) {
            setFeedback({ type: "error", message: "Image must be JPG, JPEG, or PNG." });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFeedback({ type: "error", message: "Maximum image size is 5MB." });
            return;
        }

        // Tampilkan preview segera setelah lolos validasi tipe & ukuran
        const url = URL.createObjectURL(file);
        setAvatarFile(file);
        setAvatarPreview(url);
        setFeedback({ type: "", message: "" });

        // Berikan rekomendasi non-blocking untuk kualitas avatar (opsional)
        const img = new Image();
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            const ratio = w / h;
            if (w < 512 || h < 512 || ratio < 0.8 || ratio > 1.25) {
                setFeedback({ type: "", message: "For best results, use a square image ≥ 512×512." });
            }
        };
        img.src = url;
    };

    useEffect(() => {
        if (!userData) return;
        setName(userData?.name || "");
        setEmail(userData?.email || "");
        setPhone(userData?.phoneNumber || "");
        setGender(userData?.gender || "");
        const initialCountryId = userData?.country?.id ? String(userData.country.id) : "";
        const initialCityId = userData?.city?.id ? String(userData.city.id) : "";
        setCountryId(initialCountryId);
        setSelectedCountry(initialCountryId);
        setCityId(initialCityId);
        setPreferences(Array.isArray(userData?.preferences) ? userData.preferences : []);

        // Format bornDate to YYYY-MM-DD for input[type="date"]
        if (userData?.bornDate) {
            try {
                const d = new Date(userData.bornDate);
                // Adjust to local date string YYYY-MM-DD
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                setBornDate(`${yyyy}-${mm}-${dd}`);
            } catch { }
        } else {
            setBornDate("");
        }

        if (userData?.profilePictureUrl) {
            setAvatarPreview(`${env.VITE_API_BASE_URL}/rooms/image/${userData?.profilePictureUrl}`);
        }
    }, [userData]);

    const clearPasswordSection = () => {
        setNewPassword("");
        setConfirmPassword("");
        setShowNew(false);
        setShowConfirm(false);
        setErrors((prev) => {
            const next = { ...prev };
            delete next.newPassword;
            delete next.confirmPassword;
            return next;
        });
    };

    const addPreferenceToken = () => {
        const token = prefInput.trim();
        if (!token) return;
        setPreferences((prev) => (prev.includes(token) ? prev : [...prev, token]));
        setPrefInput("");
    };

    const removePreferenceToken = (idx) => {
        setPreferences((prev) => prev.filter((_, i) => i !== idx));
    };

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const validatePhone = (value) => /^\+?[0-9\s-]{7,20}$/.test(value);
    const validateStrongPassword = (value) => value.length >= 8;

    const validateForm = () => {
        const next = {};
        if (!name || name.trim().length < 3) next.name = "Name must be at least 3 characters";
        if (!email || !validateEmail(email)) next.email = "Invalid email address";
        if (!phone || !validatePhone(phone)) next.phone = "Invalid phone number";
        if (!gender) next.gender = "Gender is required";
        if (!countryId) next.countryId = "Country is required";
        if (!cityId) next.cityId = "City is required";

        if (currentPassword) {
            if (!validateStrongPassword(currentPassword))
                next.currentPassword = "Current password must be at least 8 characters";
            if (!newPassword || !validateStrongPassword(newPassword))
                next.newPassword = "New password must be at least 8 characters";
            if (!confirmPassword)
                next.confirmPassword = "Confirmation password is required";
            if (newPassword && confirmPassword && newPassword !== confirmPassword)
                next.confirmPassword = "Confirmation does not match the new password";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ type: "", message: "" });

        if (!currentPassword) clearPasswordSection();

        const valid = validateForm();
        if (!valid) {
            setFeedback({ type: "error", message: "Please review invalid inputs." });
            return;
        }

        try {
            if (avatarFile && userData?.id) {
                await uploadAvatar.mutateAsync({ userId: userData.id, file: avatarFile });
            }

            if (userData?.id) {
                const payload = {
                    name,
                    email,
                    phoneNumber: phone || undefined,
                    // kirim undefined jika address kosong agar backend bisa mengabaikan
                    // sesuai schema backend: gender adalah enum ["male","female"], huruf kecil
                    gender: gender || undefined,
                    // sesuai schema backend: countryId & cityId bertipe string
                    countryId: countryId || undefined,
                    cityId: cityId || undefined,
                    bornDate: bornDate ? new Date(bornDate).toISOString() : undefined,
                    preferences: Array.isArray(preferences)
                        ? preferences.map((p) => String(p).trim()).filter(Boolean)
                        : undefined,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                    confirmPassword: confirmPassword || undefined,
                };

                await updateProfile(payload);
            }

            setFeedback({ type: "success", message: "Changes saved successfully ✨" });
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to save changes. Please try again." });
        }
    };

    return (
        <div className="min-h-screen mx-auto max-w-4xl bg-white px-4 sm:px-6 text-foreground">
            {/* Card container */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                {/* Foto Profil */}
                <h2 className="text-lg font-semibold">Profile Photo</h2>
                <div className="mt-4 flex flex-col items-center">
                    <div className="relative h-28 w-28 rounded-full border border-border bg-white shadow-sm grid place-items-center overflow-hidden">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="preview" className="h-full w-full object-cover" />
                        ) : (
                            <User className="text-muted-foreground" size={36} />
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={".jpg,.jpeg,.png,image/jpeg,image/png"}
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-semibold text-black shadow-sm transition-colors hover:bg-secondary"
                    >
                        <Upload size={18} /> Upload Foto
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">JPG, JPEG, or PNG • Max 5MB • Recommended: square ≥ 512×512</p>
                </div>

                <hr className="my-6 border-border" />

                {/* Form Profil */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <FormField label="Full Name" required error={errors.name}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            placeholder="Alex Johnson"
                        />
                    </FormField>

                    {/* Email */}
                    <FormField label="Email" required error={errors.email}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            placeholder="alex.johnson@email.com"
                        />
                    </FormField>
                    {/* Gender & Tanggal Lahir (2 kolom) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Gender" required error={errors.gender}>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </FormField>

                        <FormField label="Birth Date" required={false} error={errors.bornDate}>
                            <input
                                type="date"
                                value={bornDate}
                                onChange={(e) => setBornDate(e.target.value)}
                                className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            />
                        </FormField>
                    </div>

                    {/* Negara & Kota (2 kolom) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Country" required error={errors.countryId}>
                            <select
                                value={countryId}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCountryId(val);
                                    setSelectedCountry(val);
                                    setCityId("");
                                }}
                                className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            >
                                <option value="">Select country</option>
                                {isLoadingCountries && <option disabled>Loading countries...</option>}
                                {countries?.map((country) => (
                                    <option key={country.id} value={String(country.id)}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="City" required error={errors.cityId}>
                            <select
                                value={cityId}
                                onChange={(e) => setCityId(e.target.value)}
                                className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                disabled={!countryId}
                            >
                                <option value="">Select city</option>
                                {isLoadingCities && <option disabled>Loading cities...</option>}
                                {isErrorCities && <option disabled>Error loading cities</option>}
                                {(citires || []).map((city) => (
                                    <option key={city.id} value={String(city.id)}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    {/* Preferences (tags input) */}
                    <FormField label="Preferences" required={false} error={errors.preferences}>
                        <div className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-400">
                            <div className="flex flex-wrap items-center gap-2">
                                {preferences.map((pref, idx) => (
                                    <span key={`${pref}-${idx}`} className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-black">
                                        {pref}
                                        <button
                                            type="button"
                                            onClick={() => removePreferenceToken(idx)}
                                            className="ml-1 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                                            aria-label="Remove preference"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={prefInput}
                                    onChange={(e) => setPrefInput(e.target.value)}
                                    onBlur={addPreferenceToken}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                            e.preventDefault();
                                            addPreferenceToken();
                                        }
                                    }}
                                    className="flex-1 min-w-[160px] bg-transparent outline-none"
                                    placeholder="Add a preference then press Enter/Space"
                                />
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Press Enter or Space to create a tag.</p>
                    </FormField>



                    {/* Phone Number */}
                    <FormField label="Phone Number" required error={errors.phone}>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            placeholder="+1234567890"
                        />
                    </FormField>

                    {/* Current Password */}
                    <FormField label="Current Password" required error={errors.currentPassword}>
                        <div className="mt-1 relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    if (!e.target.value) clearPasswordSection();
                                }}
                                className="w-full rounded-2xl border border-border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none"
                                placeholder="Enter your password to confirm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                                aria-label="Toggle password current"
                            >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Required to confirm profile changes</p>
                    </FormField>

                    {/* Password Baru + Konfirmasi (Collapse) */}
                    <div
                        className={
                            "overflow-hidden transition-all duration-300 " +
                            (passwordSectionVisible
                                ? "max-h-[320px] opacity-100 translate-y-0"
                                : "max-h-0 opacity-0 -translate-y-1 pointer-events-none")
                        }
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField label="New Password" required={passwordSectionVisible} error={errors.newPassword}>
                                <div className="mt-1 relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none"
                                        placeholder="At least 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                                        aria-label="Toggle password new"
                                    >
                                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormField>

                            <FormField label="Confirm New Password" required={passwordSectionVisible} error={errors.confirmPassword}>
                                <div className="mt-1 relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none"
                                        placeholder="Repeat new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                                        aria-label="Toggle password confirm"
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormField>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-end">
                        <button
                            type="submit"
                            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-primary"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Note */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Security Note:</span> Your data is protected with encryption and only accessible by you. We will not share your personal information with third parties without your consent.
            </div>
        </div>
    );
};

/**
 * Reusable FormField with label, required marker, and error message
 */
const FormField = ({ label, required, error, children }) => {
    return (
        <div>
            <label className="text-sm font-medium">
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};
