import { useState, useEffect } from "react";
import { MapPin, Briefcase, Zap, Brain, Mail, Globe, User, Mars, Venus, Sparkles, Heart, Utensils, Handshake, CalendarCheck, CreditCard, Pencil, Plus, Building2, Ticket } from "lucide-react";
import { useProfile, useUpdateBankProfile } from "../hooks/useProfile";
import Markdown from "react-markdown";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { useNavigate } from "react-router-dom";
import { resetProfilingStorage } from "../../profiling/utils/reset.js";
import { useAuth } from "../../../core/auth/useAuth";
import { LoginModal } from "../../auth/components/LoginModal";
import { env } from "../../../core/config/env.js";
import { useAuthStore } from "../../auth/stores/authStore.js";

/**
 * Profile Page
 * - Matches the provided reference layout
 * - Uses current theme palette (bg-primary, bg-secondary, bg-muted, etc.)
 * - Responsive and consistent spacing, radius, and shadows
 */
export const Profile = () => {
    const { data: profile, isLoading, isError } = useProfile();
    const { mutateAsync: updateBankProfile } = useUpdateBankProfile();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const getMe = useAuthStore((state) => state.getMe);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [activeTab, setActiveTab] = useState("personality"); // personality | payment

    useEffect(() => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        } else {
            setShowLoginModal(false);
        }
    }, [isAuthenticated]);


    const handleRegenerate = () => {
        resetProfilingStorage();
        navigate("/profiling/questioner");
    };

    return (
        <div className="min-h-screen mx-auto max-w-7xl bg-white text-foreground px-4 sm:px-8">
            <FadeIn show={!isLoading}>
                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    <>
                        {/* Header Profile */}
                        <section className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 sm:p-8 shadow-sm">
                            <div className="flex flex-col items-center text-center sm:grid sm:grid-cols-[112px_1fr] sm:items-center sm:gap-6 sm:text-left">
                                {/* Avatar */}
                                {profile?.profilePictureUrl ? (
                                    <img
                                        src={env.VITE_API_BASE_URL + '/rooms/image/' + profile?.profilePictureUrl}
                                        alt={profile?.name}
                                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-white shadow mx-auto sm:mx-0"
                                    />
                                ) : (
                                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gray-100 border-4 border-white shadow mx-auto sm:mx-0 flex items-center justify-center">
                                        <User className="text-primary" size={48} />
                                    </div>
                                )}

                                {/* Identity */}
                                <div>
                                    <h1 className="text-4xl sm:text-5xl font-bold capitalize">{profile?.name}</h1>
                                    <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                                        {/* Basic info */}
                                        <Badge icon={User} text={profile?.age} />
                                        <Badge icon={profile?.gender === "male" ? Mars : Venus} text={profile?.gender} />
                                        <Badge icon={Mail} text={profile?.email} />
                                        <Badge icon={MapPin} text={profile?.city?.name} />
                                        <Badge icon={Globe} text={profile?.country?.name} />
                                        <Badge icon={Briefcase} text={profile?.occupation} />
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:max-w-3xl mx-auto sm:mx-0">
                                        <StatCard icon={Utensils} type={'Attended'} label={'Dinners'} value={profile?.joinedRoomCounts?.dinner} />
                                        <StatCard icon={Handshake} type={'Attended'} label={'Meetups'} value={profile?.joinedRoomCounts?.meetup} />
                                        <StatCard icon={CalendarCheck} type={'Attended'} label={'Events'} value={profile?.joinedRoomCounts?.event} />
                                        <StatCard icon={Ticket} type={'Hosted'} label={'Activity'} value={profile?.joinedRoomCounts?.roomCreated} valueClass="text-lg truncate max-w-[120px] sm:max-w-none" />
                                    </div>

                                    {/* Preferences / Interests */}
                                    {profile?.preferences?.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-primary/10">
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2 justify-center sm:justify-start">
                                                <Heart size={16} className="text-rose-500" />
                                                Interests & Hobbies
                                            </h3>
                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start sm:max-w-xl">
                                                {profile?.preferences.map((pref) => (
                                                    <span
                                                        key={pref.id}
                                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-white/80 hover:bg-white text-foreground border border-primary/10 shadow-sm transition-all hover:scale-105 cursor-default"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                                        {pref.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Main Content with Tabs */}
                        <section className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                            {/* Tabs Header */}
                            <div className="flex items-center border-b border-border px-6 sm:px-8 pt-6">
                                <button
                                    onClick={() => setActiveTab("personality")}
                                    className={`pb-4 px-4 text-sm font-semibold transition-all relative ${activeTab === "personality"
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    Personality
                                    {activeTab === "personality" && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("payment")}
                                    className={`pb-4 px-4 text-sm font-semibold transition-all relative ${activeTab === "payment"
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    Payouts
                                    {activeTab === "payment" && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                                    )}
                                </button>
                            </div>

                            {/* Tab Content: Personality */}
                            {activeTab === "personality" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <Brain size={30} className="text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-semibold">Analysis of Personality Type</h2>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Based on your profile & responses to the questionnaire.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-2 self-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
                                            <Zap size={16} /> AI Powered
                                        </span>
                                    </div>

                                    {profile?.descPersonal ? (
                                        <>
                                            {/* Summary */}
                                            <div className="mx-6 sm:mx-8 mb-6 rounded-2xl bg-muted p-4 sm:p-5 border border-border">
                                                <h3 className="font-semibold mb-2">Summary of Personality</h3>
                                                <div className="text-sm sm:text-base text-muted-foreground">
                                                    <Markdown>{profile?.descPersonal}</Markdown>
                                                </div>
                                            </div>

                                            {/* MBTI Type */}
                                            <div className="mt-6 p-6 sm:p-8 border-t border-border">
                                                <h3 className="font-semibold mb-3">Type of Personality</h3>
                                                <div className="rounded-2xl bg-muted p-5 border border-border">
                                                    <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-wide">
                                                        {profile?.mbti}
                                                    </div>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {profile?.mbtiDesc}
                                                    </p>
                                                </div>
                                                <div className="mt-6 flex justify-end">
                                                    <button
                                                        onClick={() => handleRegenerate()}
                                                        className="group cursor-pointer relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-white font-semibold text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF9836] to-[#FF7A2F] transition-transform duration-300 group-hover:scale-105"></div>
                                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine"></div>
                                                        <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                                                        <span className="relative z-10">Regenerate Personality</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pb-10 pt-5 px-4 text-center space-y-6">
                                            <button
                                                onClick={() => handleRegenerate()}
                                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-white font-semibold text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9836] to-[#FF7A2F] transition-transform duration-300 group-hover:scale-105"></div>
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine"></div>
                                                <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                                                <span className="relative z-10">Generate Your Personality</span>
                                            </button>
                                            <div className="max-w-md space-y-2">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Discover Your Inner Traveler
                                                </h3>
                                                <p className="text-sm text-gray-500 leading-relaxed">
                                                    Not sure what fits you? Let our AI analyze your vibe and craft
                                                    a personalized travel profile just for you.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab Content: Payment */}
                            {activeTab === "payment" && (
                                <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                                <CreditCard size={28} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold">Payout Details</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Manage the bank account where you will receive payments from your events.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowBankModal(true)}
                                            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-secondary hover:shadow-md cursor-pointer"
                                        >
                                            {profile?.bankName ? <Pencil size={16} /> : <Plus size={16} />}
                                            {profile?.bankName ? "Update Account" : "Add Account"}
                                        </button>
                                    </div>

                                    {/* Bank Card Display */}
                                    {profile?.bankName ? (
                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg sm:max-w-md">
                                            {/* Background Decoration */}
                                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
                                            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>

                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="text-primary" />
                                                        <span className="font-bold tracking-wider">{profile.bankName}</span>
                                                    </div>
                                                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80 border border-white/10">
                                                        Primary
                                                    </span>
                                                </div>

                                                <div className="mb-2">
                                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Account Number</p>
                                                    <p className="font-mono text-2xl tracking-widest shadow-black drop-shadow-sm">
                                                        {profile.bankAccount}
                                                    </p>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Account Holder</p>
                                                        <p className="font-medium text-sm capitalize">{profile.name}</p>
                                                    </div>
                                                    <div className="h-8 w-12 bg-white/20 rounded flex items-center justify-center">
                                                        <div className="h-4 w-6 bg-yellow-500/50 rounded-sm"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-12 text-center">
                                            <div className="mb-4 rounded-full bg-muted p-4">
                                                <CreditCard className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground">No Bank Account Added</h3>
                                            <p className="mt-1 max-w-xs text-sm text-muted-foreground mb-6">
                                                Add your bank details to receive payouts from your events.
                                            </p>
                                            <button
                                                onClick={() => setShowBankModal(true)}
                                                className="text-sm font-semibold text-primary hover:text-secondary hover:underline"
                                            >
                                                Add Bank Account Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </FadeIn>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />

            <BankInfoModal
                isOpen={showBankModal}
                onClose={() => setShowBankModal(false)}
                onSuccess={() => {
                    setShowBankModal(false);
                    getMe(false); // Refresh user data in auth store silently
                }}
                updateBankProfile={updateBankProfile}
                initialData={{ bankName: profile?.bankName, bankAccount: profile?.bankAccount }}
            />
        </div>
    );
};

/** Small badge component */
const Badge = ({ icon: Icon, text }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-3 py-1 text-sm shadow-sm">
        <Icon size={16} className="text-primary" />
        <span className="capitalize">
            {text}
        </span>
    </span>
);


/** Stat card */
const StatCard = ({ icon: Icon, label, value, type }) => (
    <div className="rounded-2xl bg-card border border-border p-4 text-center shadow-sm h-full flex flex-col items-center justify-center gap-1">
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Icon size={18} className="text-secondary" />
        </div>
        <div className={`font-bold leading-none ${"text-2xl"}`}>{value}</div>
        {/* <div className={`text-xs mt-1 ${label !== 'Hosted' ? 'text-muted-foreground' : 'invisible select-none'}`}>
            {type}
        </div> */}
        {/* Gunakan gap-0 untuk nempel, atau gap-0.5 untuk jarak tipis */}
        <div className="flex flex-col gap-0">
            <div className="text-xs text-muted-foreground">{type}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    </div>
);

/** Chip */
const Chip = ({ children }) => (
    <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-sm shadow-sm">
        {children}
    </span>
);

const BankInfoModal = ({ isOpen, onClose, onSuccess, updateBankProfile, initialData }) => {
    const [bankName, setBankName] = useState(initialData?.bankName || "");
    const [bankAccount, setBankAccount] = useState(initialData?.bankAccount || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Update state when initialData changes (e.g. when profile loads)
    useEffect(() => {
        if (initialData) {
            setBankName(initialData.bankName || "");
            setBankAccount(initialData.bankAccount || "");
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError("");
        if (!bankName || !bankAccount) {
            setError("Both fields are required.");
            return;
        }
        setIsLoading(true);
        try {
            await updateBankProfile({ bankName, bankAccount });
            onSuccess();
        } catch (err) {
            console.error("Update bank failed", err);
            setError("Failed to update bank info. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Bank Information</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                        <Plus className="rotate-45" size={20} />
                    </button>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                    Add or update your bank details for seamless transactions.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Bank Name</label>
                        <div className="relative">
                            <select
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                            >
                                <option value="">Select Bank</option>
                                {["BCA", "MANDIRI", "BRI", "BNI", "CIMB", "BSI", "PERMATA", "JENIUS", "JAGO"].map((bank) => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Bank Account Number</label>
                        <input
                            type="text"
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. 1234567890"
                        />
                    </div>

                    {error && <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-secondary disabled:opacity-70 transition-all transform active:scale-95"
                        >
                            {isLoading ? "Saving..." : "Save Information"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
