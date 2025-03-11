import { useState } from 'react'
import React from 'react'

export default function Navbar() {
    const [loggedIn] = useState(false)
    const [showServices] = useState(true)
    const [isServicesOpen, setIsServicesOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between gap-4 py-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src="../../../public/logo.svg" alt="Logo" className="h-8 w-8 rounded-lg" />
                        <span className="text-xl font-bold text-gray-800">PIXELWARE</span>
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
                                    className=" cursor-pointer flex items-center gap-1 text-gray-600 hover:text-gray-800"
                                    onClick={() => setIsServicesOpen(!isServicesOpen)}>
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                </button>

                                {isServicesOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                        <div className="p-2">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                                Servicio 1
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                                Servicio 2
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                                Servicio 3
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Usuario o botones */}
                        {loggedIn ? (
                            <div className="flex items-center gap-2">
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-700">John Doe</p>
                                    <p className="text-xs text-gray-500">Premium</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Dropdown de servicios - Mobile */}
                                {showServices && (
                                    <div className="md:hidden relative">
                                        <button
                                            className="p-2 text-gray-600 hover:text-gray-800"
                                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                            <i className="fa-solid fa-circle-exclamation"></i>
                                        </button>

                                        {isMobileMenuOpen && (
                                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                                <div className="p-2">
                                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                                        Servicio 1
                                                    </a>
                                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                                        Servicio 2
                                                    </a>
                                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                                        Servicio 3
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                        Iniciar sesión
                                    </button>
                                    <button className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                                        Registrarse
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
