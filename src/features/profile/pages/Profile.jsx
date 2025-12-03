import { useState, useEffect } from "react";
import { MapPin, Briefcase, Zap, Brain, Mail, Globe, User, Mars, Venus, Sparkles, Heart, Utensils, Handshake, CalendarCheck, CreditCard } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import Markdown from "react-markdown";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { useNavigate } from "react-router-dom";
import { resetProfilingStorage } from "../../profiling/utils/reset.js";
import { useAuth } from "../../../core/auth/useAuth";
import { LoginModal } from "../../auth/components/LoginModal";
import { env } from "../../../core/config/env.js";

/**
 * Profile Page
 * - Matches the provided reference layout
 * - Uses current theme palette (bg-primary, bg-secondary, bg-muted, etc.)
 * - Responsive and consistent spacing, radius, and shadows
 */
export const Profile = () => {
    const { data: profile, isLoading, isError } = useProfile();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

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
                                        {console.log('bank', profile)}
                                        {profile?.bankName && (
                                            <Badge icon={CreditCard} text={`${profile?.bankName} - ${profile?.bankAccount}`} />
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-md mx-auto sm:mx-0">
                                        <StatCard icon={Utensils} label={'Dinners'} value={profile?.joinedRoomCounts?.dinner} />
                                        <StatCard icon={Handshake} label={'Meetups'} value={profile?.joinedRoomCounts?.meetup} />
                                        <StatCard icon={CalendarCheck} label={'Events'} value={profile?.joinedRoomCounts?.event} />

                                    </div>

                                    {/* Preferences / Interests */}
                                    {profile?.preferences?.length > 0 && (
                                        <div className="mt-2 pt-6 border-primary/10">
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

                        {/* Main Content */}
                        <section className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
                            {/* Header */}

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8">

                                {/* Bagian Kiri: Icon & Teks */}
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

                                {/* Bagian Kanan: Badge AI */}
                                <span className="inline-flex items-center gap-2 self-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
                                    <Zap size={16} /> AI Powered
                                </span>

                            </div>
                            {profile?.descPersonal ? (<>
                                {/* Summary */}
                                <div className="mx-6 sm:mx-8 mb-6 rounded-2xl bg-muted p-4 sm:p-5 border border-border">
                                    <h3 className="font-semibold mb-2">Summary of Personality</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        <Markdown>
                                            {profile?.descPersonal}
                                        </Markdown>
                                    </p>
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
                                            {/* Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF9836] to-[#FF7A2F] transition-transform duration-300 group-hover:scale-105"></div>

                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine"></div>

                                            {/* Content */}
                                            <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                                            <span className="relative z-10">Regenerate Personality</span>
                                        </button>
                                    </div>
                                </div>
                            </>) : (

                                <div className="flex flex-col items-center justify-center pb-10 pt-5 px-4 text-center space-y-6">

                                    <button
                                        onClick={() => handleRegenerate()}
                                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-white font-semibold text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Gradient Background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF9836] to-[#FF7A2F] transition-transform duration-300 group-hover:scale-105"></div>

                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine"></div>

                                        {/* Content */}
                                        <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                                        <span className="relative z-10">Generate Your Personality</span>
                                    </button>

                                    {/* Wording Menarik */}
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
                        </section>
                    </>
                )}
            </FadeIn>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
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
const StatCard = ({ icon: Icon, label, value }) => (
    <div className="rounded-2xl bg-card border border-border p-4 text-center shadow-sm">
        <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Icon size={18} className="text-secondary" />
        </div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
);

/** Chip */
const Chip = ({ children }) => (
    <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-sm shadow-sm">
        {children}
    </span>
);
