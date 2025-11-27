import React from 'react'
import logoText from "../../../assets/logo/logo-text-white.svg";
export const Hero = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen bg-[var(--color-primary)]">
            <img src={logoText} alt="ConnectX" className="w-5xl " />
        </div>
    )
}