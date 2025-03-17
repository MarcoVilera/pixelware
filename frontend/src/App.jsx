// import reactLogo from './assets/react.svg'
import Index from './pages/Index'
import ErrorPage from './pages/ErrorPage'
import Product from './pages/Product'
import Login from './pages/Login'
import Register from './pages/Register'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/:productId" element={<Product />} />
                <Route path="*" element={<ErrorPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
