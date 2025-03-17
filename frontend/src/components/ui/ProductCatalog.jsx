import { useState } from 'react'
import Categories from './Categories'
import ProductGrid from './ProductGrid'

const ProductCatalog = () => {
    const [selectedCategory, setSelectedCategory] = useState(null)

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <Categories onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />

            <ProductGrid selectedCategory={selectedCategory} onClearFilter={() => setSelectedCategory(null)} />
        </div>
    )
}

export default ProductCatalog
