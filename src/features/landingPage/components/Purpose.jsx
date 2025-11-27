import React from "react";
import person1 from "../../../assets/people/person1.svg";
import person2 from "../../../assets/people/person2.svg";
import person3 from "../../../assets/people/person3.svg";
import imageCollage from "../../../assets/people/group.svg";
import findImage from "../../../assets/people/find.svg";
import hostImage from "../../../assets/people/host.svg";
import { useNavigate } from "react-router-dom";

export const Purpose = () => {
    const navigate = useNavigate();
    return (
        <div className="mt-[80px]">
            <div className="md:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20">
                        <div className="flex-1 flex flex-col justify-center items-start max-w-lg mb-10 md:mb-0 order-2 md:order-1">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                We exist to connect<br />
                                you with people who<br />
                                match your vibe.
                            </h1>
                            <p className="text-lg text-gray-700 mb-8">
                                We want our community to find meaningful and authentic connections that match their vibe.
                            </p>
                            <button onClick={() => navigate("/profiling/questioner")} className="bg-black hover:cursor-pointer text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-800 cursor-pointer">Start Now</button>
                        </div>

                        <div className="flex-shrink-0 flex justify-center items-center relative order-1 md:order-2" style={{ minHeight: '340px', minWidth: '380px' }}>
                            <div className="absolute left-0 z-30 w-[260px] h-[340px] rounded-2xl overflow-hidden shadow-lg bg-white flex-shrink-0">
                                <img src={person1} alt="Meetup" className="w-full h-full object-cover" />
                            </div>

                            <div className="absolute left-[80px] z-20 w-[220px] h-[290px] rounded-2xl overflow-hidden shadow-lg bg-white flex-shrink-0" >
                                <img src={person2} alt="Meetup" className="w-full h-full object-cover opacity-80" />
                            </div>

                            <div className="absolute left-[160px] z-10 w-[180px] h-[240px] rounded-2xl overflow-hidden shadow-lg bg-white flex-shrink-0" >
                                <img src={person3} alt="Meetup" className="w-full h-full object-cover opacity-60" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-white p-4 sm:p-8 lg:p-16 flex justify-center items-center">
                <div className="max-w-7xl w-full bg-[#F3F3F3] rounded-xl p-6 md:p-10 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        <div className="flex items-center justify-center">
                            <img
                                src={imageCollage}
                                alt="ConnectX User Collage"
                                className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-xl"
                            />
                        </div>
                        <div className="flex flex-col justify-center space-y-6">
                            <h1 className="text-xl md:text-6xl font-extrabold text-black leading-tight">
                                Let's connect smarter
                            </h1>
                            <p className="text-gray-700 text-lg">
                                ConnectX has helped thousands find meaningful connections from friendships to career circles, creative communities, and inspiring conversations. <br />
                                <br />
                                Whether it’s smarter AI matchmaking, better personality-based group suggestions, or new tools that help you host your own meetups safely and effortlessly, you’ll be the first to see how we’re shaping the future of real-life connection. Let’s build a world where meeting the right people feels easy, natural, and authentic  with ConnectX at the center of it.
                            </p>
                            <button onClick={() => navigate("/profiling/questioner")} className="bg-black hover:cursor-pointer text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-800 cursor-pointer transition duration-300 w-fit">
                                Start Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 lg:p-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="rounded-t-2xl overflow-hidden bg-[var(--color-primary)]">
                        <div className="relative p-6 md:p-8">
                            <div className=" rounded-lg overflow-hidden h-[300px] md:h-[350px] flex items-center justify-center">
                                <img
                                    src={findImage}
                                    alt="Find Connection Collage"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="p-6 md:px-8 pt-0 mb-14">
                            <h2 className="text-3xl font-extrabold text-black mb-3">
                                Find Connection
                            </h2>
                            <p className="text-base text-gray-800">
                                Join dinners, meetups, and events. Matched by your interests, personality, and city.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-t-2xl shadow-xl overflow-hidden bg-[var(--color-secondary)]">
                        <div className="relative p-6 md:p-8">
                            <div className="bg-white rounded-lg overflow-hidden h-[300px] md:h-[350px] flex items-center justify-center shadow-lg">
                                <img
                                    src={hostImage}
                                    alt="Host It Collage"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="p-6 md:px-8 pt-0  mb-14">
                            <h2 className="text-3xl font-extrabold text-black mb-3">
                                Host It
                            </h2>
                            <p className="text-base text-gray-800">
                                Create your own gathering with one prompt. AI builds the event for you details, setup, and suggested participants.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}