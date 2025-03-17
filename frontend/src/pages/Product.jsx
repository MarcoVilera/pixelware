import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import StarRating from './StarRating' // Componente de estrellas personalizado
import Layout from '../layout/Layout'

const Product = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const renderStars = (rating) => {
        const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating
        const fullStars = Math.floor(numericRating)
        const hasHalfStar = numericRating % 1 >= 0.5

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
            </div>
        )
    }
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/products/${productId}`)
                const data = await response.json()
                console.log(data)
                console.log(data.product.rating.totalRatings)
                if (!data.success) {
                    throw new Error(data.error || 'Producto no encontrado')
                }

                setProduct(data.product)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [productId])

    if (loading) return <div>Cargando...</div>
    if (error) return <div className="text-red-500 p-4">{error}</div>
    if (!product) return null

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Galería de imágenes */}
                    <div className="space-y-4">
                        {/* Imagen principal */}
                        <div className="aspect-square bg-gray-100 rounded-lg p-4">
                            <img
                                src={product.images[selectedImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                key={selectedImageIndex} // Importante para forzar re-render
                            />
                        </div>

                        {/* Miniaturas */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg p-1 cursor-pointer border-2 transition-all ${
                                        index === selectedImageIndex ? 'border-primary scale-105' : 'border-transparent hover:border-gray-300'
                                    }`}>
                                    <img src={img} alt={`Vista ${index + 1}`} className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalles del producto */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">{product.name}</h1>

                        <div className="flex items-center gap-2">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-600">{product.totalRatings?.toLocaleString() || 0} valoraciones</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                            </div>

                            <div className="text-green-600 font-medium">En stock ({product.stock} disponibles)</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border rounded-lg">
                                    -
                                </button>
                                <span className="text-xl">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border rounded-lg">
                                    +
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark">
                                    Añadir a la cesta
                                </button>
                                <button className="bg-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-600">Comprar ahora</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-2">Características principales</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    {product.description.split('\n').map((feature, i) => (
                                        <li key={i} className="text-gray-700">
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-2">Especificaciones</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Peso máximo:</span>
                                            <span className="font-medium">180 kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Batería:</span>
                                            <span className="font-medium">Incluida</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product
