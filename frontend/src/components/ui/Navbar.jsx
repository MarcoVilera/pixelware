import { useState, useEffect } from 'react'
import React from 'react'
import { useService } from '../../contexts/ServiceContext'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState('')
    const [isServicesOpen, setIsServicesOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { serviceData } = useService()

    // Se ejecuta una sola vez al montar el componente
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(storedUser)
            setLoggedIn(true)
        }
    }, [])
    const handleLogout = () => {
        localStorage.removeItem('user')
        Cookies.remove('token')
        setLoggedIn(false)
    }
    // Verificar si hay algún servicio con status "Error"
    const showServices = serviceData && serviceData.some((service) => service.status === 'Error')
    console.log(serviceData)

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between gap-4 py-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="../../../public/logo.svg" alt="Logo" className="h-8 w-8 rounded-lg" />
                            <span className="text-xl font-bold text-gray-800">PIXELWARE</span>
                        </Link>
                    </div>

                    {/* Buscador */}
                    <div className="order-last w-full md:order-none md:w-auto md:flex-1 relative">
                        <input
                            type="search"
                            placeholder="Buscar..."
                            className="w-full rounded-lg border px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>

                    {/* Sección derecha */}
                    <div className="flex items-center gap-4">
                        {/* Dropdown de servicios - Desktop */}
                        {showServices && (
                            <div className="hidden md:block relative">
                                <button
                                    className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-gray-800"
                                    onClick={() => setIsServicesOpen(!isServicesOpen)}>
                                    <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                                </button>
                                {isServicesOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                        <div className="p-2">
                                            {serviceData
                                                ?.filter((service) => service.status !== 'OK')
                                                ?.map((service) => (
                                                    <div
                                                        key={service.service}
                                                        className="flex items-center justify-between px-3 py-2 text-sm rounded hover:bg-gray-50">
                                                        <span className="flex-1">{service.name} está caído, algunas funciones pueden fallar...</span>
                                                        <span className="ml-2 text-red-500 animate-pulse">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Usuario o botones */}
                        {loggedIn ? (
                            <div className="flex items-center gap-2">
                                <div className="text-gray-700 transition-all  hover:text-blue-500 cursor-pointer">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                </div>
                                <div className=" md:block">
                                    <p className="text-sm font-medium text-gray-700">{user}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                <div className="text-gray-300 transition-all  hover:text-red-500 cursor-pointer" onClick={handleLogout}>
                                    <i class="fa-solid fa-right-from-bracket"></i>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Dropdown de servicios - Mobile */}
                                {showServices && (
                                    <div className="md:hidden relative">
                                        <button
                                            className="p-2 text-gray-600 hover:text-gray-800"
                                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                                        </button>

                                        {isMobileMenuOpen && (
                                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                                <div className="p-2">
                                                    {serviceData
                                                        ?.filter((service) => service.status !== 'OK')
                                                        ?.map((service) => (
                                                            <div
                                                                key={service.service}
                                                                className="flex items-center justify-between px-3 py-2 text-sm rounded hover:bg-gray-50">
                                                                <span className="flex-1">
                                                                    {service.name} está caído, algunas funciones pueden fallar...
                                                                </span>
                                                                <span className="ml-2 text-red-500 animate-pulse">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor">
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Link to="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                                        Registrarse
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
