import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo/main-logo-white.png";
import linkedin from "../../../assets/logo/linkedin.png";
import youtube from "../../../assets/logo/youtube.png";
import telegram from "../../../assets/logo/telegram.png";
import tiktok from "../../../assets/logo/tiktok.png";
import x from "../../../assets/logo/x.png";
import instagram from "../../../assets/logo/instagram.png";
import whatsapp from "../../../assets/logo/whatsapp.png";
import threads from "../../../assets/logo/threads.png";
import { useAuth } from "../../../core/auth/useAuth";

export const FooterMain = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    return (
        <footer className="w-full py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Top Divider */}
                <div className="w-full h-px bg-gray-300 mb-8"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left Section: Logo and Links */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">

                        <div className="flex items-center gap-6 text-gray-400 text-sm font-medium">
                            <img src={logo} alt="ConnectX" className="h-8 sm:h-10" />
                            <div onClick={() => navigate("/home")} className="hover:text-secondary cursor-pointer transition-colors">Dashboard</div>
                            <div href="https://getconnectx.com/" target="_blank" className="hover:text-secondary cursor-pointer transition-colors">News</div>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center md:justify-center w-full md:w-auto my-4 md:my-0">
                        <div onClick={() => navigate("new-event")} rel="noopener noreferrer" className="cursor-pointer text-primary hover:text-secondary text-sm font-medium flex items-center gap-1 transition-colors">
                            Make events with ConnectX ↗
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-4">
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
                </div>
            </div>
        </footer>
    );
};
