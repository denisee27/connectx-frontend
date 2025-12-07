import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFind } from '../hooks/useFind';
import { env } from '../../../core/config/env';
import { format } from 'date-fns';

export default function Event() {
    const { data: findData = [], isLoading, isError } = useFind();
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
                                    src={env.VITE_API_BASE_URL + "/rooms/image/" + event?.banner}
                                    alt={event?.title}
                                    className="w-full h-full object-cover"
                                />
                                <span
                                    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full text-white bg-[var(--color-primary)]`}>
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
                                        <span>{format(event?.datetime, 'dd MMM yyyy, HH:mm')}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-700 mb-4">
                                        <span className="mr-2 text-sm"><MapPin size={15} /></span>
                                        <span>{event?.address}</span>
                                    </div>

                                </div>

                                <button
                                    onClick={() => navigate('/home/event/' + event?.slug)}
                                    className="w-full bg-primary text-white font-semibold py-2 rounded-4xl hover:bg-secondary cursor-pointer transition duration-300 mt-auto"
                                >
                                    Join Event
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate('/home/list-event')} className="inline-flex items-center justify-center border border-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300">
                    View All Events
                </button>

            </div>
        </div>
    );
}