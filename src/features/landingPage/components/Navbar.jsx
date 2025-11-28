import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../../assets/logo/main-logo-black.svg";
import StaggeredMenu from "../utils/staggeredMenu/StaggeredMenu";
import { resetProfilingAll } from "../../profiling/utils/reset";

export const Navbar = ({ scrollToElement }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Discover', ariaLabel: 'Discover', link: '/home' },
        { label: 'About Us', ariaLabel: 'About Us', link: 'about-us' },
        { label: 'Find', ariaLabel: 'Find', link: 'find' },
        { label: 'How It Works', ariaLabel: 'How It Works', link: 'how-it-works' }
    ];

    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'GitHub', link: 'https://github.com' },
        { label: 'LinkedIn', link: 'https://linkedin.com' }
    ];

    const handleStartNow = () => {
        resetProfilingAll();
        navigate("/profiling/questioner");
    }
    const handleSignOut = async () => {
        navigate("/");
    };

    const handleScroll = (e, elementId) => {
        e.preventDefault();
        scrollToElement(elementId, { offset: 100 }); // Adjust offset as needed
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="hidden md:flex container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between w-full h-16">

                    <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                        <img src={logo} alt="ConnectX" className="h-8 sm:h-10" />
                    </div>

                    <div className="hidden md:flex justify-center items-center h-full flex-1 mx-4">
                        <div className="max-w-2xl bg-white/50 backdrop-blur-lg rounded-2xl flex items-center gap-4 justify-center">
                            <button onClick={(e) => navigate('/home')} className="bg-transparent text-black font-semibold px-5 py-3 rounded-2xl transition-all duration-150 hover:bg-white cursor-pointer text-sm">Discover</button>
                            <button onClick={(e) => handleScroll(e, 'about-us')} className="bg-transparent text-black font-semibold px-5 py-3 rounded-2xl transition-all duration-150 hover:bg-white cursor-pointer text-sm">About Us</button>
                            <button onClick={(e) => handleScroll(e, 'find')} className="bg-transparent text-black font-semibold px-5 py-3 rounded-2xl transition-all duration-150 hover:bg-white cursor-pointer text-sm">Find</button>
                            <button onClick={(e) => handleScroll(e, 'how-it-works')} className="bg-transparent text-black font-semibold px-5 py-3 rounded-2xl transition-all duration-150 hover:bg-white cursor-pointer text-sm">How It Works</button>
                        </div>
                    </div>


                    <div className="flex items-center justify-end">
                        {user ? (
                            <button
                                className="rounded-full border-2 border-gray-800 text-gray-800 font-semibold px-3 py-1 text-sm hover:bg-gray-800 hover:text-white transition-colors"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-4">
                                {/* <button className="hidden sm:flex rounded-xl px-3 py-2 bg-white/50 backdrop-blur-lg text-black font-semibold items-center gap-1 shadow-md hover:bg-white cursor-pointer transition-all duration-150 text-sm" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
                                    <div className="flex align-middle gap-1 ">
                                        <Globe />
                                    </div>
                                </button> */}

                                <button onClick={() => navigate("/login")} className="rounded-xl px-4 py-2 bg-transparent border-2 border-black text-black font-semibold hover:bg-gray-800 hover:text-white cursor-pointer transition-all duration-150 text-sm" >
                                    Sign In
                                </button>
                                <button className="rounded-xl px-4 py-2 bg-black text-white font-semibold hover:bg-gray-800 cursor-pointer transition-all duration-150 text-sm" onClick={() => handleStartnow()} >
                                    Start Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="md:hidden h-16">
                <StaggeredMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    className="flex md:hidden"
                    position="right"
                    items={menuItems.map(item => ({ ...item, onClick: (e) => handleScroll(e, item.link.substring(1)) }))}
                    socialItems={socialItems}
                    displaySocials={false}
                    displayItemNumbering={false}
                    menuButtonColor="#000000"
                    openMenuButtonColor="#000000"
                    changeMenuColorOnOpen={true}
                    colors={['var(--color-accent)', 'var(--color-secondary)']}
                    logoUrl={logo}
                    accentColor="var(--color-primary)"
                    isFixed={true}
                    onMenuOpen={() => setIsMenuOpen(true)}
                    onMenuClose={() => setIsMenuOpen(false)}
                />
            </div>
        </nav >
    );
};