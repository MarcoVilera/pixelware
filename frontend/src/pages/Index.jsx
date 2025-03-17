import React from 'react'
import Layout from '../layout/Layout'
import Carousel from '../components/ui/Carousel'
import ProductCatalog from '../components/ui/ProductCatalog'

const Index = () => {
    return (
        <Layout>
            <div className=" flex items-center justify-center flex-col">
                <Carousel />
                <ProductCatalog />
            </div>
        </Layout>
    )
}

export default Index
