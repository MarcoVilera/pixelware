import React from 'react'
import './global.css'
import Navbar from '../components/ui/NavBar'

export default function Layout({ children }) {
    return (
        <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            {/* Contenido principal */}
            <main className="">{children}</main>
        </div>
    )
}
