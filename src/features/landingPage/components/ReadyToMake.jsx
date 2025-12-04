export const ReadyToMake = () => {
    return (
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
                {/* <div className="flex w-full justify-center gap-12 text-center">
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
                        </div> */}
            </div>
        </div>
    );
};