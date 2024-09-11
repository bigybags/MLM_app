import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa'; // Import FontAwesome Plus icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle navigation to the product details page
  const handleNavigate = () => {
    navigate(`/dashboard/products/${product.id}`);
  };

  return (
    <Card
      onClick={handleNavigate} // Navigate on card click
      className="shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer position-relative"
      style={{
        width: '300px', // Make the card wider
        height: '230px', // Shorter height
        borderRadius: '10px',
        overflow: 'hidden',
        border: 'none',
      }}
    >
      {/* Plus Button on the Top Right */}
      <Button
        variant="light"
        className="position-absolute"
        style={{
          top: '10px',
          right: '10px',
          borderRadius: '50%',
          padding: '5px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          zIndex: 10, // Ensure button is clickable over image
        }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click (navigation)
          onAddToCart(product); // Run add to cart function
        }}
      >
        <FaPlus size={12} />
      </Button>

      {/* Card Body with Image as Background */}
      <Card.Body
        style={{
          backgroundImage: `url(${product.image_url})`, // Set image as background in card body
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '0', // Remove padding to cover the full body
          height: '100%', // Cover the whole body
        }}
      />

      {/* Card Footer with Product Name and Price */}
      <Card.Footer
        className="d-flex flex-column justify-content-between"
        style={{
          backgroundColor: 'white', // White background for footer
          padding: '10px',
          borderTop: 'none', // No border between body and footer
        }}
      >
        <Card.Title
          className="mb-1"
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: 'black',
            textAlign: 'left', // Left-aligned text
          }}
        >
          {product.name}
        </Card.Title>
        <Card.Text
          className="font-medium mb-0"
          style={{
            fontSize: '12px',
            color: 'black',
            textAlign: 'left', // Left-aligned text
          }}
        >
          {`£${product.price}`}
        </Card.Text>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
