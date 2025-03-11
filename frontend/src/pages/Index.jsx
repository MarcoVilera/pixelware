import React from 'react'
import Layout from '../layout/layout'
import Carousel from '../components/ui/Carousel'
import Categories from '../components/ui/Categories'
const Index = () => {
    return (
        <Layout>
            <div className=" flex items-center justify-center flex-col">
                <Carousel />
                <Categories />
            </div>
        </Layout>
    )
}

export default Index
