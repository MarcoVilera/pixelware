import React from 'react'
import './global.css'
import Navbar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
export default function Layout({ children }) {
    return (
        <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            {/* Contenido principal */}
            <main className="">{children}</main>
            <Footer />
        </div>
    )
}
