import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExternalLink, MapPin, Users, CalendarCheck, Handshake, Utensils, ExternalLinkIcon } from "lucide-react";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";
import { env } from "../../../core/config/env.js";
import { useCity } from "../hooks/useCity.js";

const labelDay = (iso) => {
    const d = new Date(iso);
    const monthShort = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.toLocaleDateString("en-US", { day: "2-digit" });
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    return { dayLabel: `${monthShort} ${day}`, dayName: weekday, time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) };
};

function HeaderSection({ title, description, latitude, longitude, countryName }) {

    // Fungsi untuk membersihkan data input yang kotor
    const cleanCoordinate = (val, type) => {
        if (!val) return 0;

        // 1. Bersihkan jika ada text aneh (misal: "31 106.82" -> ambil yg belakang atau format ulang)
        // Kita ubah ke string dulu, lalu parse ulang
        let strVal = String(val).trim();

        // Jika inputnya seperti "31 106.82", kita coba ambil angka terakhir yang masuk akal
        // atau langsung parseFloat. 
        let num = parseFloat(strVal);

        // 2. Logika Normalisasi (Perbaikan untuk kasus -61.75 Jakarta)
        const max = type === 'lat' ? 90 : 180;

        // Loop pembagian standar
        while (Math.abs(num) > max && num !== 0) {
            num /= 10;
        }

        // HACK KHUSUS: Jika ini Jakarta (indonesia) tapi angkanya puluhan (misal -61),
        // kemungkinan besar data source-nya salah koma. 
        // Latitude Jakarta itu sekitar -6, bukan -61.
        // Kita paksa bagi 10 lagi jika user berada di Indonesia dan latitudenya > 10 atau < -10
        // (Ini optional, tapi solusi cepat untuk data Anda yang -61.75)
        if (type === 'lat' && Math.abs(num) > 15 && countryName?.toLowerCase() === 'indonesia') {
            num /= 10;
        }

        return num;
    };

    const lat = cleanCoordinate(latitude, 'lat');
    const lng = cleanCoordinate(longitude, 'lng');

    // URL Peta yang BENAR
    // Menggunakan https://maps.google.com/maps
    // Parameter q = query (koordinat)
    // Parameter z = zoom
    // Parameter output = embed (tampilan iframe)
    const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=12&output=embed`;

    return (
        <section className="relative rounded-3xl bg-white text-foreground shadow-sm border border-border overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="p-8 sm:p-10 lg:col-span-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-semibold text-primary tracking-wide uppercase">City Guide</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">{title} - {countryName}</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                        {description || `Explore the best events and communities in ${title}. Discover meetups, workshops, and gatherings happening around you.`}
                    </p>
                </div>

                {/* Bagian Peta */}
                <div className="relative h-64 lg:h-auto lg:col-span-2 min-h-[320px] bg-muted border-t lg:border-t-0 lg:border-l border-border">
                    <iframe
                        title={`Map of ${title}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={mapSrc}
                        className="absolute inset-0 w-full h-full"
                        style={{ filter: "grayscale(0.2) contrast(1.1)" }}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]"></div>
                </div>
            </div>
        </section>
    );
}


// Event Card (copied structure & styling from Schedule.jsx)
const EventCard = ({ time, title, location, guests, thumbnail, onClick, type, placeName, gmaps }) => {
    const getIcon = (label) => {
        const lowerLabel = label?.toLowerCase();
        if (lowerLabel === "dinner") return <Utensils size={14} className="text-white" />;
        if (lowerLabel === "meetup") return <Handshake size={14} className="text-white" />;
        return <CalendarCheck size={14} className="text-white" />;
    };

    return (
        <div data-testid="event-card" onClick={onClick} className="cursor-pointer flex items-center justify-between gap-3 md:gap-6 rounded-2xl border border-border bg-card p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {type && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF9836] px-3 py-1 text-xs font-bold text-white shadow-sm capitalize">
                            {getIcon(type)}
                            {type}
                        </span>
                    )}
                    <div className="text-xs md:text-sm text-muted-foreground leading-[1.5]">{time}</div>
                </div>
                <h3 className="mt-1 text-base md:text-xl font-semibold leading-[1.5] line-clamp-2">
                    {title}
                </h3>

                <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground leading-[1.5]">
                    {placeName && gmaps && (
                        <a
                            href={gmaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 hover:text-primary transition-colors z-10"
                        >
                            <MapPin size={16} />
                            {placeName}
                            <ExternalLinkIcon size={16} />
                        </a>
                    )}
                    {!placeName && <span className="inline-flex items-center gap-1"><MapPin size={16} /> {location}</span>}
                    <span className="inline-flex items-center gap-1"><Users size={16} /> {guests}</span>
                </div>
            </div>

            {/* Thumbnail */}
            <div className="shrink-0">
                <img
                    src={env.VITE_API_BASE_URL + '/rooms/image/' + thumbnail}
                    alt="event thumbnail"
                    className="h-24 w-24 md:h-36 md:w-36 rounded-xl object-cover"
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export const DetailCity = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { data: cityData, isPending: isPendingCity } = useCity(slug);
    console.log(cityData)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDetail = useCallback((id) => navigate(`/home/event/${id}`), [navigate]);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-foreground ">
                {isPendingCity ? (
                    <div className="space-y-6">
                        <SkeletonLoader className="h-48 w-full rounded-3xl" />
                        <div className="space-y-4">
                            <SkeletonLoader className="h-10 w-3/4 rounded-lg" />
                            <SkeletonLoader className="h-24 w-full rounded-lg" />
                        </div>
                    </div>
                ) : (
                    <FadeIn show={!isPendingCity}>
                        <HeaderSection
                            title={cityData?.name}
                            description={cityData?.description}
                            latitude={cityData?.latitude}
                            longitude={cityData?.longitude}
                            countryName={cityData?.country?.name}
                        />
                    </FadeIn>
                )}

                {/* Loading / Error */}
                {loading && (
                    <div className="mt-8 space-y-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <SkeletonLoader key={index} className="h-32 w-full rounded-2xl" />
                        ))}
                    </div>
                )}
                {error && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
                )}

                {/* List - mirror schedule timeline, with mobile re-ordering */}
                {!loading && !error && (
                    <FadeIn show={!loading}>
                        <div className="mt-8 relative">
                            {/* Continuous vertical line: aligned with dot center and spaced top/bottom */}
                            <div data-testid="timeline-line" className="absolute left-[10px] md:left-[132px] md:sm:left-[178px] top-3 bottom-3 w-px bg-border" aria-hidden />

                            {(() => {
                                const grouped = new Map();
                                cityData?.rooms?.forEach((it) => {
                                    const { dayLabel, dayName, time } = labelDay(it.datetime);
                                    const entry = grouped.get(dayLabel) || { dayLabel, dayName, items: [] };
                                    entry.items.push({ ...it, time });
                                    grouped.set(dayLabel, entry);
                                });
                                const days = Array.from(grouped.values());
                                return (
                                    <div className="space-y-8 md:space-y-10 transition-all duration-300 ease-out">
                                        {days.map((day, di) => (
                                            <div key={`${day.dayLabel}-${di}`} className="relative">
                                                {/* Mobile: 2 cols (dot, content). Desktop: 3 cols (date, dot, cards) */}
                                                <div className="grid grid-cols-[20px_1fr] md:grid-cols-[100px_24px_1fr] sm:md:grid-cols-[140px_28px_1fr] gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-6 items-start" data-testid="day-grid">
                                                    {/* 1. Dot */}
                                                    <div className="relative col-start-1 row-start-1 md:col-start-2 md:row-start-1">
                                                        <div data-testid="timeline-dot" className="absolute left-1/2 -translate-x-1/2 top-2 h-3 w-3 rounded-full bg-primary border-2 border-white shadow" aria-hidden />
                                                    </div>

                                                    {/* 2. Date & Day: mobile right of dot, desktop left column */}
                                                    <div className="col-start-2 row-start-1 md:col-start-1 md:row-start-1 text-left md:text-right pr-0 md:pr-2 sm:md:pr-3" data-testid="mobile-date-label">
                                                        <div className="text-xl sm:text-2xl font-semibold leading-tight">{day.dayLabel}</div>
                                                        <div className="text-sm sm:text-base text-muted-foreground leading-tight">{day.dayName}</div>
                                                    </div>

                                                    {/* 3. Cards: below date on mobile, right column on desktop */}
                                                    <div className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 space-y-6">
                                                        {day.items.map((ev) => (
                                                            <>
                                                                <EventCard
                                                                    key={`${day.dayLabel}-${ev.id}`}
                                                                    time={ev.time}
                                                                    title={ev.title}
                                                                    location={ev?.city?.name}
                                                                    guests={typeof ev._count.participants === "number" ? (ev.maxParticipant === 0 ? "Capacity" : `${ev.maxParticipant} capacity`) : ev.maxParticipant}
                                                                    thumbnail={ev.banner}
                                                                    type={ev.type}
                                                                    placeName={ev.placeName}
                                                                    gmaps={ev.gmaps}
                                                                    onClick={() => onDetail(ev.slug)}
                                                                />
                                                            </>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
};

export default DetailCity;