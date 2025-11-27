import React from 'react';
import Event1 from "../../../assets/event/event1.svg";
import Event2 from "../../../assets/event/event2.svg";
import Event3 from "../../../assets/event/event3.svg";
import Event4 from "../../../assets/event/event4.svg";
import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFind } from '../hooks/useFind';

// Data untuk setiap acara
const events = [
    {
        image: Event1,
        tag: "Networking",
        title: "Monday Night Social",
        date: "Mon, Dec 18 at 7:00 PM",
        location: "Downtown Bar",
        attendees: "18/20 attending",
    },
    {
        image: Event2,
        tag: "Learning",
        title: "Creative Workshop",
        date: "Wed, Dec 20 at 6:30 PM",
        location: "Art Studio",
        attendees: "12/15 attending",
    },
    {
        image: Event3,
        tag: "Social",
        title: "Food & Friends",
        date: "Thu, Dec 21 at 8:00 PM",
        location: "Italian Bistro",
        attendees: "10/12 attending",
    },
    {
        image: Event4,
        tag: "Outdoor",
        title: "Weekend Hike",
        date: "Sat, Dec 23 at 9:00 AM",
        location: "Mountain Trail",
        attendees: "15/20 attending",
    },
];

function formatEventDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "";
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const dayName = days[d.getDay()];
    const dayNum = String(d.getDate()).padStart(2, "0");
    const monthName = months[d.getMonth()];
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${dayName}, ${dayNum} ${monthName}, ${hh}.${mm}`;
}
export default function Event() {
    const { data: findData = [], isLoading, isError } = useFind();
    console.log('findData', findData);
    const navigate = useNavigate();
    return (
        <div className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-2">
                    This week's events
                </h2>
                <p className="text-lg text-gray-600 mb-12">
                    Join unique experiences designed to help you connect and grow
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {findData?.data?.map((event, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden text-left"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={event?.banner}
                                    alt={event?.title}
                                    className="w-full h-full object-cover"
                                />
                                <span
                                    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full text-black bg-[var(--color-primary)]`}>
                                    {event?.category?.name}
                                </span>
                            </div>

                            <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {event?.title}
                                    </h3>

                                    <div className="flex items-center text-sm text-gray-700 mb-1">
                                        <span className="mr-2 text-sm"><Calendar size={15} /></span>
                                        <span>{event?.datetime}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-700 mb-1">
                                        <span className="mr-2 text-sm"><MapPin size={15} /></span>
                                        <span>{event?.address}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-700 mb-4">
                                        <span className="mr-2 text-sm"><Users size={15} /></span>
                                        <span>{event?._count?.participants} attending</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-primary text-white font-semibold py-2 rounded-4xl hover:bg-secondary cursor-pointer transition duration-300 mt-auto"
                                >
                                    Join Event
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate('/home')} className="inline-flex items-center justify-center border border-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300">
                    View All Events
                </button>

            </div>
        </div>
    );
}