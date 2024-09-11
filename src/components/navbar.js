import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaBars, FaShoppingCart, FaUserCircle, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Button, ListGroup, Image } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartcontext';
import { API_URL } from "../utils/config";


const TopNavbar = ({ toggleSidebar, handleShowCart }) => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const userId = Cookies.get('userId');
  const [address, setAddress] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimeout = useRef(null); // Ref to hold debounce timeout

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/get_latest_order/?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAddress(data);
      } catch (error) {
        console.error('Error fetching the latest order:', error);
      }
    };

    fetchLatestOrder();
  }, [userId]);

  // Debounce search term to hit API after user stops typing for 2 seconds
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear previous timeout if typing starts again
    }

    if (searchTerm) {
      debounceTimeout.current = setTimeout(() => {
        setIsLoading(true);
        fetchSearchResults();
      }, 1000); // 2-second debounce
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      clearTimeout(debounceTimeout.current); // Cleanup timeout on unmount
    };
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`${API_URL}/products-search/?search_term=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data); // Assuming the API returns the array of product objects
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    setShowResults(false);
    navigate(`/dashboard/products/${productId}`);
  };

  const handleLogout = () =>{
    Cookies.remove('userId')
    navigate('/login')
  }


  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex justify-between items-center px-4">
      {/* Sidebar toggle button */}
      <div className="flex items-center">
        <FaBars size="1.5em" className="cursor-pointer" onClick={toggleSidebar} />
        <img src="//bigybags.com/cdn/shop/files/Bigy_Bags-logo_300x300.png?v=1649403703" alt="Biggy Bags" className="h-14 w-16 ml-4" />
      </div>

      {/* Address and Search Bar */}
      <div className="flex items-center justify-center flex-1 mx-4">
        {address && (
          <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 mr-4 text-black text-sm">
            <FaMapMarkerAlt className="mr-2" />
            <span>{address.address_line_1}, {address.city}, {address.country}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative flex items-center bg-gray-200 rounded-full flex-1 text-sm">
          <FaSearch className="text-gray-500 mx-3" />
          <input
            type="text"
            placeholder="candy spray, magic sipper, etc"
            className="bg-gray-200 border-0 rounded-full flex-1 py-2 px-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => {
              setTimeout(() => setShowResults(false), 1000)
            }} 
          />
          {isLoading && <div className="mx-2">Loading...</div>}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 z-10">
              <ListGroup>
                {searchResults.map((product) => (
                  <ListGroup.Item key={product.id} action onClick={() => handleProductClick(product.id)} className="flex items-center gap-4">
                    <Image src={product.image_url} alt={product.name} rounded style={{ width: '50px', height: '50px' }} />
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-gray-600">£{product.price}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </div>
      </div>

      {/* Cart and User Profile */}
      <div className="flex items-center">
        {/* Cart button */}
        <div className="relative" onClick={handleShowCart}>
          <FaShoppingCart size="1.5em" className="mx-4 cursor-pointer" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* User Profile */}
        <FaUserCircle size="1.5em" className="mx-4 cursor-pointer" />

        {/* Logout Button */}
        <Button variant="outline-danger" className="ml-4" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default TopNavbar;
