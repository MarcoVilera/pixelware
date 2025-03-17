import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
const ProductGrid = ({ selectedCategory, onClearFilter }) => {
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchProducts = async () => {
        setIsLoading(true)
        setError(null)
        try {
            let url = `http://localhost:5000/products?page=${currentPage}&limit=${itemsPerPage}`

            if (selectedCategory) {
                url += `&category=${encodeURIComponent(selectedCategory)}`
            }

            const response = await fetch(url)

            if (!response.ok) throw new Error('Error al obtener productos')

            const { data, pagination } = await response.json()

            setProducts(data)
            setTotalPages(pagination.totalPages)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setCurrentPage(1)
        fetchProducts()
    }, [selectedCategory, itemsPerPage])

    const handleItemsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value)
        setItemsPerPage(newLimit)
        setCurrentPage(1)
    }

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1))
    }

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
    }

    const renderRatingStars = (rating) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="relative">
                        <span className={`text-lg ${index < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>

                        {index === fullStars && hasHalfStar && (
                            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                                <span className="text-lg text-yellow-400">★</span>
                            </div>
                        )}
                    </div>
                ))}
                <span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
            </div>
        )
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>
    }

    return (
        <div className="product-grid-container">
            <div className="controls flex justify-between items-center">
                <div className="flex items-center gap-4 mb-4">
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        disabled={isLoading}
                        className="border rounded px-4 py-2 bg-white">
                        <option value="10">10 productos</option>
                        <option value="20">20 productos</option>
                        <option value="30">30 productos</option>
                    </select>

                    {selectedCategory && (
                        <button onClick={onClearFilter} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                            Limpiar filtro ({selectedCategory})
                        </button>
                    )}
                </div>

                {isLoading && <div className="text-gray-500 italic">Cargando productos...</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {products.map((product) => (
                    <Link key={product.id} to={`/${product.id}`} className="block h-full hover:no-underline">
                        <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
                            {/* Contenedor de la imagen con altura fija */}
                            <div className="h-48 w-full overflow-hidden">
                                {product.images?.length > 0 && (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-t-lg" />
                                )}
                            </div>

                            {/* Contenido con altura flexible */}
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{product.description}</p>

                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                                    {renderRatingStars(product.rating.average)}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center items-center gap-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Anterior
                </button>

                <span className="text-gray-600">
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Siguiente
                </button>
            </div>
        </div>
    )
}

export default ProductGrid
