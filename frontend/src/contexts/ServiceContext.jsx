// contexts/ServiceContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ServiceContext = createContext()

export const ServiceProvider = ({ children }) => {
    const [serviceData, setServiceData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchServiceStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/health', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.json()
            //Get from data.data the status of each service
            const DatatoExtract = data.data
            setServiceData(
                DatatoExtract.map((service) => {
                    return {
                        name: service.service,
                        status: service.status,
                    }
                })
            )
            setError(null)
        } catch (err) {
            setError({
                message: 'Error fetching service status',
                details: err.message,
            })
            setServiceData(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchServiceStatus()
        const interval = setInterval(fetchServiceStatus, 300000) // 5 minutes
        return () => clearInterval(interval)
    }, [])

    return <ServiceContext.Provider value={{ serviceData, isLoading, error }}>{children}</ServiceContext.Provider>
}

export const useService = () => {
    const context = useContext(ServiceContext)
    if (!context) {
        throw new Error('useHealth must be used within a HealthProvider')
    }
    return context
}
