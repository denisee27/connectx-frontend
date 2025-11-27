import React from "react";
import { MapPin, Briefcase, CalendarDays, Zap, Users, Brain, Mail, Globe, User, Mars, Venus } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import Markdown from "react-markdown";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";

/**
 * Profile Page
 * - Matches the provided reference layout
 * - Uses current theme palette (bg-primary, bg-secondary, bg-muted, etc.)
 * - Responsive and consistent spacing, radius, and shadows
 */
export const Profile = () => {
    const { data: profile, isLoading, isError } = useProfile();
    console.log(profile)
    const user = profile?.data || {
        name: "Budi Santoso",
        city: "Jakarta",
        role: "Software Engineer",
        age: "28 tahun",
        email: "budi.santoso@example.com",
        country: "Indonesia",
        gender: "Laki-laki",
        avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=320&auto=format&fit=crop",
        stats: [
            { icon: CalendarDays, label: "Events", value: 15 },
            { icon: Zap, label: "Meetups", value: 12 },
            { icon: Users, label: "Dinners", value: 23 },
        ],
        mbti: {
            type: "INTJ",
            summary:
                "Anda adalah seorang pemikir strategis dengan visi jangka panjang yang kuat. Anda cenderung analitis, mandiri, dan sangat menghargai efisiensi.",
            interests: [
                "Technology",
                "Innovation",
                "Strategic Planning",
                "Problem Solving",
                "Data Analysis",
                "System Design",
            ],
            description: "Direct and efficient, prefers facts over emotions",
        },
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
                                <img
                                    src={profile?.profilePicture || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=320&auto=format&fit=crop"}
                                    alt={profile?.name}
                                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-white shadow mx-auto sm:mx-0"
                                />

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
                                    <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-md mx-auto sm:mx-0">
                                        {user?.stats?.map((s) => (
                                            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Main Content */}
                        <section className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 sm:p-8">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <Brain size={30} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-semibold">Analisis Kepribadian MBTI</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Berdasarkan analisis mendalam dari respons kuesioner Anda
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent-foreground">
                                    <Zap size={16} /> AI Powered
                                </span>
                            </div>

                            {/* Summary */}
                            <div className="mx-6 sm:mx-8 mb-6 rounded-2xl bg-muted p-4 sm:p-5 border border-border">
                                <h3 className="font-semibold mb-2">Ringkasan Kepribadian</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    <Markdown>
                                        {profile?.descPersonal}
                                    </Markdown>
                                </p>
                            </div>

                            {/* MBTI Type */}
                            <div className="mt-6 p-6 sm:p-8 border-t border-border">
                                <h3 className="font-semibold mb-3">Tipe Kepribadian</h3>
                                <div className="rounded-2xl bg-muted p-5 border border-border">
                                    <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-wide">
                                        {profile?.mbti}
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {user.mbti.description}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </FadeIn>
        </div>
    );
};

/** Small badge component */
const Badge = ({ icon: Icon, text }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-3 py-1 text-sm shadow-sm">
        <Icon size={16} className="text-muted-foreground" />
        <span className="capitalize">
            {text}
        </span>
    </span>
);

/** Navigation chip */
const NavChip = ({ children, active = false }) => (
    <button
        type="button"
        className={
            "rounded-full px-4 py-2 text-sm transition-colors " +
            (active ? "bg-primary text-white" : "bg-muted hover:bg-primary/10")
        }
    >
        {children}
    </button>
);

/** Stat card */
const StatCard = ({ icon: Icon, label, value }) => (
    <div className="rounded-2xl bg-card border border-border p-4 text-center shadow-sm">
        <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Icon size={18} className="text-muted-foreground" />
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
