import { useMemo } from "react";

export default function WeatherTicker({ weatherData }) {
    const tickerItems = useMemo(() => {
        if (!weatherData) return [];

        const items = [];

        // Weather items
        if (weatherData.weather?.length > 0) {
            weatherData.weather.forEach((w) => {
                items.push(`${w.city}: ${w.description} ${w.temp}°C`);
            });
        }
        return items;
    }, [weatherData]);

    if (tickerItems.length === 0) return null;

    // Duplicate items for seamless loop
    const tickerText = tickerItems.join(" | ");

    return (
        <div className="w-full overflow-hidden bg-[#173c94]">
            <div className="flex items-center h-10 md:h-12">
                {/* BMKG Label */}
                <div className="flex-shrink-0 bg-yellow-400 text-[#173c94] font-bold text-xs md:text-sm px-3 md:px-4 h-full flex items-center gap-2 z-10 shadow-md">
                    <img
                        src="/storage/images/logoBMKG.webp"
                        alt="BMKG"
                        className="h-6 md:h-7 w-auto"
                    />
                    <span>BMKG</span>
                </div>

                {/* Marquee */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="marquee-track whitespace-nowrap text-white text-xs md:text-sm font-medium">
                        <span className="inline-block marquee-content px-4">
                            {tickerText}
                        </span>
                        <span className="inline-block marquee-content px-4">
                            {tickerText}
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                .marquee-track {
                    display: flex;
                    animation: marquee-scroll 40s linear infinite;
                }
                .marquee-content {
                    flex-shrink: 0;
                }
                @keyframes marquee-scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
