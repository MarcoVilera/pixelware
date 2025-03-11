import { useState } from 'react'

const Categories = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const categoriesPerPage = 6

    const allCategories = [
        'PCs de Escritorio',
        'Laptops',
        'Procesadores',
        'Tarjetas Gráficas',
        'Memorias RAM',
        'Almacenamiento SSD',
        'Fuentes de Poder',
        'Tarjetas Madre',
        'Refrigeración Líquida',
        'Monitores Gaming',
        'Teclados Mecánicos',
        'Mouse Gaming',
    ]

    const totalPages = Math.ceil(allCategories.length / categoriesPerPage)
    const currentCategories = allCategories.slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage)

    const handlePrevious = () => setCurrentPage((prev) => Math.max(1, prev - 1))
    const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))

    return (
        <div className="max-w-4xl mx-auto p-4 relative group">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categorías</h2>
            {/* Flechas de navegación */}
            <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full shadow-lg hover:scale-110 transition-transform
            ${currentPage === 1 ? 'text-gray-300 cursor-default' : 'text-blue-500 bg-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full shadow-lg hover:scale-110 transition-transform
            ${currentPage === totalPages ? 'text-gray-300 cursor-default' : 'text-blue-500 bg-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Contenido del carrusel */}
            <div className="grid grid-cols-6 md:grid-cols-6 gap-4 mx-8">
                {currentCategories.map((category, index) => (
                    <button
                        key={index}
                        className="p-4 border rounded-lg hover:border-blue-500 hover:text-blue-500
                      transition-all duration-200 text-gray-700 text-sm font-medium
                      h-20 flex items-center justify-center text-center">
                        {category}
                    </button>
                ))}
            </div>

            {/* Indicadores de página */}
            <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${currentPage === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Categories
