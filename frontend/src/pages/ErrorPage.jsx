import { Link } from 'react-router-dom'

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-lg text-center space-y-6">
                {/* Ilustración */}
                <div className="relative w-64 h-64 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="95" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
                        <path d="M70 50L130 50L150 70V150L130 170H70L50 150V70L70 50Z" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                        <path d="M70 50L130 50L150 70V80L70 80L50 70L70 50Z" fill="#3B82F6" />
                        <circle cx="100" cy="120" r="30" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                        <path d="M100 110V130" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="100" cy="135" r="2" fill="#EF4444" />
                    </svg>
                </div>

                {/* Texto */}
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-gray-900">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800">¡Página no encontrada!</h2>
                    <p className="text-gray-600">
                        La página que estás buscando podría haber sido eliminada, cambiado de nombre o temporalmente no disponible.
                    </p>
                </div>

                {/* Botón */}
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-colors duration-200
                    font-medium shadow-sm hover:shadow-md">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    )
}

export default ErrorPage
