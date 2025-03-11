// import reactLogo from './assets/react.svg'
import Navbar from './components/ui/NavBar'
import Layout from './layout/layout'
import Index from './pages/Index'
import ErrorPage from './pages/ErrorPage'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                {/* <Route path="/new_partitura" element={<NewPartitura />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/crear_usuario" element={<CrearUsuario />} /> */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
