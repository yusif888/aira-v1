import React, { useState, useEffect } from "react";

const SlideShow = () => {
    // Array of static slides. You can add as many as you want here.
    const slides = [
        {
            image: "/storage/images/FHDAlur.png",
            link: "https://hidrologi.dpuair.jatimprov.go.id/pelayanan", // Optional link
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    if (slides.length === 0) return null;

    const currentSlide = slides[currentIndex];

    return (
        <div className="flex justify-center">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] group overflow-hidden bg-gray-500">
                {/* Slide Background */}
                <div
                    className="w-full h-full bg-center bg-cover duration-500 ease-in-out transition-all"
                    style={{ backgroundImage: `url(${currentSlide.image})` }}
                >
                    {/* Optional overlay to make text more readable if you add any */}
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Conditionally Render Button if link is present */}
                {currentSlide.link && currentSlide.link !== "" && (
                    <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 z-20">
                        <a
                            href={currentSlide.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm md:text-base rounded shadow-lg transition-colors duration-300"
                        >
                            Selengkapnya
                        </a>
                    </div>
                )}

                {/* Left Arrow */}
                <div className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-5 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors">
                    <button
                        onClick={goToPrevious}
                        aria-label="Previous slide"
                        className="flex items-center justify-center w-full h-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                </div>

                {/* Right Arrow */}
                <div className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 right-5 z-10 items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors">
                    <button
                        onClick={goToNext}
                        aria-label="Next slide"
                        className="flex items-center justify-center w-full h-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center py-2 space-x-2 z-10">
                    {slides.map((slide, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            aria-label={`Go to slide ${slideIndex + 1}`}
                            className={`transition-all w-3 h-3 rounded-full ${
                                currentIndex === slideIndex
                                    ? "bg-white scale-110"
                                    : "bg-white/50 hover:bg-white/80"
                            }`}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SlideShow;
