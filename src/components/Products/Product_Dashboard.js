// src/components/ProductList.js
import React, { useState, useEffect, useContext } from 'react';
import ProductCard from './Product_Card';
import Sidebar from '../sidebar';
import TopNavbar from '../navbar';
import { Container, Spinner } from 'react-bootstrap';
import { CartContext } from '../../context/cartcontext';


const products = [
  { name: 'Repurchase Pack1', category: 'Repurchase Category 1', price: 87.70 },
  { name: 'Repurchase Pack2', category: 'Repurchase Category 2', price: 175.39 },
  { name: 'Repurchase Pack3', category: 'Repurchase Category 3', price: 438.48 }
];

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);


  const fetchProducts = async () => {
    try {
      const response = await fetch('https://mustafahasnain19.pythonanywhere.com/api/products/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div>
      <Container fluid className="mt-2">
        {error ? <p>{error}</p> :
          <div className="p-6 space-y-6">
            {loading ? <Spinner size="sm"></Spinner> :
              <div className="bg-white flex flex-wrap justify-center">
                {products.map((product, index) => (
                  <ProductCard key={index} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            }
          </div>}
      </Container>
    </div>
  );
}

export default ProductDashboard;
