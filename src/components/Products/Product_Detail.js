import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Button, Alert, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaShoppingBasket } from 'react-icons/fa'; // For back navigation icon
import { CartContext } from '../../context/cartcontext';
import { API_URL } from "../../utils/config";


const ProductDetail = () => {
  const { id } = useParams(); // Extract ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate(); // For navigating back

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Fetch product details based on ID
  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/products/?id=${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      console.log("product_details: ",data)
      setProduct(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Handle Back Navigation
  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  return (
    <Row className="container mt-4 flex flex-col md:flex-row">
      <Col>
        {/* Back Navigation and Image */}
        <div className="flex flex-col items-end mb-3">
          <Button
            variant="link"
            className="text-black flex items-center mb-2 mr-[35%]"
            onClick={handleBackClick}
          >
            <FaArrowLeft className="mr-2" /> Return to Products
          </Button>
          <img
            src={product.image_url}
            alt={product.name}
            className="rounded-md"
            style={{ maxWidth: '400px', width: '100%', height: '250px'}} // Increased height
          />
        </div>
      </Col>

      <Col className="flex-1">
        {/* Product Details */}
        <div className="pl-5">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-green-600 font-semibold">{`$${product.price}`}</p>

          {/* Additional Product Information */}
          <div className="mt-2">
            <h4 className="font-bold text-lg mb-2">Product Details:</h4>
            <ul className="list-none p-0 flex flex-col gap-3">
              <li className="py-1"><strong>Description:</strong> {product.description}</li>
              <li className="py-1"><strong>Brand:</strong> {product.brand}</li>
              <li className="py-1"><strong>Weight:</strong> {product.weight}</li>
              <li className="py-1"><strong>Dimensions:</strong> {product.dimensions}</li>
              <li className="py-1"><strong>Warranty:</strong> {product.warranty}</li>
              <li className="py-1"><strong>Stock:</strong> {product.items_in_stock} items available</li>
            </ul>
          </div>

          {/* Check Availability Button */}
          <Button variant="dark" className="mt-4 flex gap-3" onClick={()=>handleAddToCart(product)}>
            <p>Add To Basket</p>
            <FaShoppingBasket size={20}/>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default ProductDetail;
