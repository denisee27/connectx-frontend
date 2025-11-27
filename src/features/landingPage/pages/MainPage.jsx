import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import HowItWorks from "../../auth/pages/HowItWorksPage";
import Event from "../components/EventPage";
import { Footer } from "../components/Footer";
import { Purpose } from "../components/Purpose";
import { useScrollTo } from "../../../shared/hooks/useScrollTo";
import { useEffect } from "react";

function MainPage() {
    const { scrollToElement } = useScrollTo();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            // Use a timeout to ensure the element is rendered before scrolling
            setTimeout(() => {
                scrollToElement(hash, { offset: 100 });
            }, 100);
        }
    }, [scrollToElement]);

    return (
        <div className="min-h-screen items-center justify-center bg-white">
            <Navbar scrollToElement={scrollToElement} />
            <Hero />
            <div id="about-us">
                <Purpose />
            </div>
            <div id="find">
                <Event />
            </div>
            <div id="how-it-works">
                <HowItWorks />
            </div>
            <Footer />
        </div>
    )
}

export default MainPage