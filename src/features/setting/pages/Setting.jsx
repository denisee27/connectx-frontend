import React, { useMemo, useRef, useState } from "react";
import { Eye, EyeOff, Upload, User } from "lucide-react";

/**
 * Setting Page – Update Profil
 * - Form data profil dasar: nama, email, telepon, alamat
 * - Password saat ini → memunculkan Password baru + Konfirmasi (dengan toggle visibility)
 * - Validasi input dan feedback yang jelas
 * - Animasi transisi halus saat menampilkan/menyembunyikan section password tambahan
 * - Styling mengikuti theme kelas yang sudah digunakan di project
 */
export const Setting = () => {
    // Foto profil
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    // Data profil
    const [name, setName] = useState("Alex Johnson");
    const [email, setEmail] = useState("alex.johnson@email.com");
    const [phone, setPhone] = useState("+1234567890");
    const [address, setAddress] = useState("123 Main Street, New York, NY 10001");

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

    const fileInputRef = useRef(null);

    const passwordSectionVisible = currentPassword.length > 0;

    const acceptTypes = useMemo(
        () => ["image/jpeg", "image/png", "image/webp"],
        []
    );

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!acceptTypes.includes(file.type)) {
            setFeedback({ type: "error", message: "Format gambar harus JPG, PNG, atau WEBP." });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFeedback({ type: "error", message: "Ukuran maksimal gambar 5MB." });
            return;
        }
        setAvatarFile(file);
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        setFeedback({ type: "", message: "" });
    };

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

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const validatePhone = (value) => /^\+?[0-9\s-]{7,20}$/.test(value);
    const validateStrongPassword = (value) => value.length >= 8;

    const validateForm = () => {
        const next = {};
        if (!name || name.trim().length < 3) next.name = "Nama minimal 3 karakter";
        if (!email || !validateEmail(email)) next.email = "Email tidak valid";
        if (!phone || !validatePhone(phone)) next.phone = "Nomor telepon tidak valid";
        if (!address || address.trim().length < 10) next.address = "Alamat kurang jelas";

        if (currentPassword) {
            if (!validateStrongPassword(currentPassword))
                next.currentPassword = "Password saat ini minimal 8 karakter";
            if (!newPassword || !validateStrongPassword(newPassword))
                next.newPassword = "Password baru minimal 8 karakter";
            if (!confirmPassword)
                next.confirmPassword = "Konfirmasi password wajib diisi";
            if (newPassword && confirmPassword && newPassword !== confirmPassword)
                next.confirmPassword = "Konfirmasi tidak cocok dengan password baru";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFeedback({ type: "", message: "" });

        // Reset section jika currentPassword kosong
        if (!currentPassword) clearPasswordSection();

        const valid = validateForm();
        if (!valid) {
            setFeedback({ type: "error", message: "Periksa kembali input yang belum valid." });
            return;
        }

        // Simulasi submit
        const payload = {
            name,
            email,
            phone,
            address,
            changePassword: !!currentPassword,
        };

        // eslint-disable-next-line no-console
        console.log("Submitting profile update", payload);

        setFeedback({ type: "success", message: "Perubahan berhasil disimpan ✨" });
    };

    return (
        <div className="min-h-screen mx-auto max-w-4xl bg-white px-4 sm:px-6 text-foreground">
            {/* Card container */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                {/* Foto Profil */}
                <h2 className="text-lg font-semibold">Foto Profil</h2>
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
                        accept={acceptTypes.join(",")}
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-semibold text-black shadow-sm transition-colors hover:bg-primary"
                    >
                        <Upload size={18} /> Upload Foto
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">JPG, PNG atau WEBP. Maksimal 5MB</p>
                </div>

                <hr className="my-6 border-border" />

                {/* Form Profil */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <FormField label="Nama Lengkap" required error={errors.name}>
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

                    {/* Nomor Telepon */}
                    <FormField label="Nomor Telepon" required error={errors.phone}>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            placeholder="+1234567890"
                        />
                    </FormField>

                    {/* Alamat */}
                    <FormField label="Alamat" required error={errors.address}>
                        <textarea
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                            placeholder="123 Main Street, New York, NY 10001"
                        />
                    </FormField>

                    {/* Password Saat Ini */}
                    <FormField label="Password Saat Ini" required error={errors.currentPassword}>
                        <div className="mt-1 relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    if (!e.target.value) clearPasswordSection();
                                }}
                                className="w-full rounded-2xl border border-border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none"
                                placeholder="Masukkan password untuk konfirmasi"
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
                        <p className="mt-1 text-xs text-muted-foreground">
                            Diperlukan untuk mengkonfirmasi perubahan profil
                        </p>
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
                            <FormField label="Password Baru" required={passwordSectionVisible} error={errors.newPassword}>
                                <div className="mt-1 relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none"
                                        placeholder="Minimal 8 karakter"
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

                            <FormField label="Konfirmasi Password Baru" required={passwordSectionVisible} error={errors.confirmPassword}>
                                <div className="mt-1 relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-border bg-white px-3 py-2 pr-10 shadow-sm focus:outline-none"
                                        placeholder="Ulangi password baru"
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
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Note */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Catatan Keamanan:</span> Data Anda
                dilindungi dengan enkripsi dan hanya dapat diakses oleh Anda. Kami tidak
                akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin Anda.
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
