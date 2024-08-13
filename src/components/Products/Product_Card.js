// src/components/ProductCard.js
import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <div className="px-6 py-4">
        <div className="flex justify-center mb-4">
          <div className="h-40 w-40 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">NO PRODUCT IMAGE</span>
          </div>
        </div>
        <div className="font-bold text-xl mb-2">{product.name}</div>
        <p className="text-gray-700 text-base">
          {product.description}
        </p>
        <p className="text-gray-900 text-lg font-bold">
          € {product.price}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 flex gap-3 justify-between">
        <button onClick={() => onAddToCart(product)} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Add To Cart</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">More Details</button>
      </div>
    </div>
  );
}

export default ProductCard;
