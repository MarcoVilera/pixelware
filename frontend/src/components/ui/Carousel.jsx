import { useState, useEffect } from 'react'

const Carousel = () => {
    const [activeSlide, setActiveSlide] = useState(0)
    const [transitionEnabled, setTransitionEnabled] = useState(true)

    const slides = [
        {
            src: '/PcGaming.webp',
            alt: 'Laptops',
            text: 'Los mejores productos',
        },
        {
            src: '/images.jpg',
            alt: 'Pc',
            text: 'Innovación tecnológica',
        },
        {
            src: '/images (1).jpg',
            alt: 'GPU',
            text: 'Componentes de calidad',
        },
    ]

    useEffect(() => {
        if (!transitionEnabled) {
            setTransitionEnabled(true)
        }
    }, [transitionEnabled])

    const handleNext = () => {
        setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }

    const handlePrev = () => {
        setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    }

    return (
        <div className="relative w-screen overflow-hidden">
            {/* Contenedor principal */}
            <div className="relative h-[200px] md:h-[250px] lg:h-[300px]">
                {/* Slides container */}
                <div
                    className={`flex h-full ${transitionEnabled ? 'transition-transform duration-500 ease-in-out' : ''}`}
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                    {slides.map((slide, index) => (
                        <div key={index} className="relative h-full w-screen flex-shrink-0">
                            <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-6">
                                <h2 className="text-lg font-bold text-white md:text-xl lg:text-2xl">{slide.text}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controles de navegación */}
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 md:left-4 md:p-2"
                aria-label="Anterior">
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 md:right-4 md:p-2"
                aria-label="Siguiente">
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setTransitionEnabled(false)
                            setActiveSlide(index)
                        }}
                        className={`h-1.5 w-6 rounded-full transition-all duration-300 ${index === activeSlide ? 'bg-white' : 'bg-white/50'}`}
                        aria-label={`Ir a slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Carousel
