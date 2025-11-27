import { Facebook, Globe, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from "../../../assets/logo/main-logo-white.png";
import qr from "../../../assets/logo/qr.svg";

export const Footer = () => {
    return (
        <div className="w-full">
            <div
                className="w-full min-h-[350px] flex flex-col justify-center items-center px-4 py-12"
                style={{ backgroundColor: "var(--color-primary)" }}
            >
                <div className="max-w-2xl w-full flex flex-col items-center gap-6">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-black mb-2">
                        Ready to make<br />new connections?
                    </h2>
                    <p className="text-lg text-center text-black mb-4">
                        Join thousands of people discovering meaningful friendships and experiences in their city
                    </p>
                    <div className="flex gap-4 mb-8">
                        <button className="bg-black text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-800 transition">Get Started Free</button>
                        <button className="bg-white text-black font-semibold px-6 py-3 rounded-full border border-black hover:bg-gray-100 transition">Learn More</button>
                    </div>
                    <hr className="w-full border-t border-black/30 mb-8" />
                    <div className="flex w-full justify-center gap-12 text-center">
                        <div>
                            <div className="text-2xl font-bold text-black">50K+</div>
                            <div className="text-sm text-black/80">Active Members</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-black">500+</div>
                            <div className="text-sm text-black/80">Monthly Events</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-black">15</div>
                            <div className="text-sm text-black/80">Cities</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-black flex items-center justify-center gap-1">4.8<span className="text-xl">★</span></div>
                            <div className="text-sm text-black/80">Avg Rating</div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="flex-1 flex items-start justify-start md:justify-start mb-6 md:mb-0">
                        <img src={logo} alt="ConnectX" className="h-30 md:h-24 p-0 m-0" />
                    </div>
                    <div className="flex flex-wrap md:flex-row gap-4 md:gap-12 flex-1 justify-between md:justify-start pe-20">
                        <div>
                            <h3 className="font-medium text-gray-500 mb-3">Our Services</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li className="border-b border-black">News</li>
                                <li className="border-b border-black">AI Match Making</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500 mb-3">Company</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li className="border-b border-black">About</li>
                                <li className="border-b border-black">Contact us</li>
                                <li className="border-b border-black">Careers <span className="inline-block">↗</span></li>
                                <li className="border-b border-black">Support <span className="inline-block">↗</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500 mb-3">Legal</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li className="border-b border-black">Guidelines</li>
                                <li className="border-b border-black">Do not sell or share my <br />
                                    personal information</li>
                                <li className="border-b border-black">Privacy policy</li>
                                <li className="border-b border-black">Terms and conditions</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col justify-between items-end md:flex-row gap-6 md:gap-12">
                    <img src={qr} alt="QR code" className="w-70 m-0 p-0 items-start hidden md:block" />
                    <div className="flex md:flex-row w-full flex-col align-items-end justify-between md:gap-25 m-0 p-0 mt-5 mx-auto md:mx-0">
                        <div className="flex gap-4 mx-auto items-center justify-center md:me-12 md:mt-0 md:mb-0  mt-5 mb-10">
                            <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Youtube className="h-4 w-4 text-white" /></a>
                            <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Instagram className="h-4 w-4 text-white" /></a>
                            <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Twitter className="h-4 w-4 text-white" /></a>
                            <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Facebook className="h-4 w-4 text-white" /></a>
                            <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Linkedin className="h-4 w-4 text-white" /></a>
                        </div>
                        <button className="md:hidden mb-2 rounded-xl px-3 py-3 border bg-black text-white font-semibold items-center gap-1 shadow-md hover:bg-gray-800 cursor-pointer transition-all duration-150 text-sm">
                            Download
                        </button>

                        <div className="flex items-center gap-4 sm:gap-4">
                            <button className="md:flex-0 flex-2 rounded-xl px-3 py-3 border border-black text-black font-semibold items-center gap-1 shadow-md hover:bg-white cursor-pointer transition-all duration-150 text-sm">
                                <div className="flex align-middle gap-1">
                                    <Globe className="mx-auto" />
                                </div>
                            </button>
                            <button className="rounded-xl md:flex flex-2 px-4 py-3 border border-black text-black font-semibold hover:bg-black hover:text-white cursor-pointer transition-all duration-150 text-sm" onClick={() => navigate("/login")} >
                                Start Now
                            </button>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    )
}