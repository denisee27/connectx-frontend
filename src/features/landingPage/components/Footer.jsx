import logo from "../../../assets/logo/main-logo-white.png";
import qr from "../../../assets/logo/qr.jpeg";
import linkedin from "../../../assets/logo/linkedin.png";
import youtube from "../../../assets/logo/youtube.png";
import telegram from "../../../assets/logo/telegram.png";
import tiktok from "../../../assets/logo/tiktok.png";
import x from "../../../assets/logo/x.png";
import instagram from "../../../assets/logo/instagram.png";
import whatsapp from "../../../assets/logo/whatsapp.png";
import threads from "../../../assets/logo/threads.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/auth/useAuth";


export const Footer = ({ scrollToElement }) => {
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();
    const handleScroll = (e, elementId) => {
        e.preventDefault();
        scrollToElement(elementId, { offset: 100 }); // Adjust offset as needed
    };
    return (
        <div className="w-full">
            <footer className="py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="flex-1 flex items-start justify-start md:justify-start mb-6 md:mb-0">
                        <img src={logo} alt="ConnectX" className="h-30 md:h-24 p-0 m-0" />
                    </div>
                    <div className="flex flex-row gap-8 md:gap-12 flex-1 justify-start md:justify-end pe-0 md:pe-30">
                        <div>
                            <h3 className="font-medium text-gray-500 mb-3">Our Services</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li className="border-b border-black"><a href="https://getconnectx.com/" target="_blank">News <span className="inline-block">↗</span></a></li>
                                <li className="border-b border-black cursor-pointer" onClick={() => navigate('/profiling/questioner')} >AI Match Making <span className="inline-block">↗</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500 mb-3">Company</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li className="cursor-pointer border-b border-black" onClick={() => navigate('/home')}>Discover</li>
                                <li className="cursor-pointer border-b border-black" onClick={(e) => handleScroll(e, 'about-us')}>About Us</li>
                                <li className="cursor-pointer border-b border-black" onClick={(e) => handleScroll(e, 'find')}>Find</li>
                                <li className="cursor-pointer border-b border-black" onClick={(e) => handleScroll(e, 'how-it-works')}>How It Works</li>
                            </ul>
                        </div>
                        {/* <div>
                            <h3 className="font-medium text-gray-500 mb-3">Legal</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li className="border-b border-black">Guidelines</li>
                                <li className="border-b border-black">Do not sell or share my <br />
                                    personal information</li>
                                <li className="border-b border-black">Privacy policy</li>
                                <li className="border-b border-black">Terms and conditions</li>
                            </ul>
                        </div> */}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col justify-between items-end md:flex-row gap-6 md:gap-12">
                    <img src={qr} alt="QR code" className="w-70 m-0 p-0 items-start hidden md:block" />
                    <div className="flex md:flex-row w-full flex-col align-items-end justify-between md:gap-25 m-0 p-0 mt-5 mx-auto md:mx-0">
                        <div className="flex flex-col gap-4 mx-auto items-center justify-center md:flex-row md:gap-4 md:mt-0 md:mb-0 mt-5 mb-10">
                            {/* Row 1 Mobile (3 icons) */}
                            <div className="flex gap-4 md:hidden">
                                <a href="https://www.threads.com/@getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={threads} alt="Tiktok" className="h-5 w-5" /></a>
                                <a href="https://chat.whatsapp.com/JgXYSPHrNGOIgpdRvlRdsj" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={whatsapp} alt="Whatsapp" className="h-5 w-5" /></a>
                                <a href="https://www.youtube.com/@getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={youtube} alt="Youtube" className="h-5 w-5" /></a>
                                <a href="https://www.tiktok.com/@getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={tiktok} alt="Tiktok" className="h-5 w-5" /></a>
                            </div>
                            {/* Row 2 Mobile (4 icons) */}
                            <div className="flex gap-4 md:hidden">
                                <a href="https://www.instagram.com/getconnectx/" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={instagram} alt="Instagram" className="h-5 w-5" /></a>
                                <a href="https://x.com/getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={x} alt="X" className="h-5 w-5" /></a>
                                <a href="https://t.me/getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={telegram} alt="Telegram" className="h-5 w-5" /></a>
                                <a href="https://www.linkedin.com/company/getconnectx/?viewAsMember=true" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={linkedin} alt="LinkedIn" className="h-5 w-5" /></a>
                            </div>
                            {/* Desktop View (All in one line) */}
                            <div className="hidden md:flex md:gap-4">
                                <a href="https://www.threads.com/@getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={threads} alt="Whatsapp" className="h-5 w-5" /></a>
                                <a href="https://chat.whatsapp.com/JgXYSPHrNGOIgpdRvlRdsj" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={whatsapp} alt="Whatsapp" className="h-5 w-5" /></a>
                                <a href="https://www.youtube.com/@getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={youtube} alt="Youtube" className="h-5 w-5" /></a>
                                <a href="https://www.tiktok.com/@getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={tiktok} alt="Tiktok" className="h-5 w-5" /></a>
                                <a href="https://www.instagram.com/getconnectx/" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={instagram} alt="Instagram" className="h-5 w-5" /></a>
                                <a href="https://x.com/getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={x} alt="X" className="h-5 w-5" /></a>
                                <a href="https://t.me/getconnectx" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={telegram} alt="Telegram" className="h-5 w-5" /></a>
                                <a href="https://www.linkedin.com/company/getconnectx/?viewAsMember=true" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-colors"><img src={linkedin} alt="LinkedIn" className="h-5 w-5" /></a>
                            </div>
                        </div>
                        {/* <button className="md:hidden mb-2 rounded-xl px-3 py-3 border bg-black text-white font-semibold items-center gap-1 shadow-md hover:bg-gray-800 cursor-pointer transition-all duration-150 text-sm">
                            Download
                        </button> */}

                        <div className="flex items-center gap-4 sm:gap-4 justify-between md:justify-end w-full md:w-auto">
                            {!isAuthenticated && (
                                <button onClick={() => navigate("/login")} className="rounded-xl px-4 py-2 bg-transparent border-2 border-black text-black font-semibold hover:bg-gray-800 hover:text-white cursor-pointer transition-all duration-150 text-sm" >
                                    Sign In
                                </button>
                            )}
                            <button className="rounded-xl px-4 py-2 bg-black text-white font-semibold hover:bg-black cursor-pointer transition-all duration-150 text-sm" onClick={() => handleStartnow()} >
                                Start Now
                            </button>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    )
}
