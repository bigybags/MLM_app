// src/components/navbar.js
import React, { useContext } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartContext } from '../context/cartcontext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const TopNavbar = ({ name, handleShowCart }) => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate()


  const handleLogout = () => {
    // Remove the userId cookie
    Cookies.remove('userId');
    navigate("/login")
  };

  return (
    <Navbar bg="light" sticky="top" className="w-full h-auto flex items-center justify-between bg-white">
      <div className="flex items-center ml-[3%] ">
        <Navbar.Brand href="#home">{name}</Navbar.Brand>
      </div>
      <Nav className="mr-[3%] flex items-center">
        {/* <Nav.Link href="#notifications" className="relative">
          <FaBell size="1.5em" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">0</span>
        </Nav.Link> */}
        <Nav.Link className="relative" onClick={handleShowCart}>
          <FaShoppingCart size="1.5em" />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {cartItems.length}
            </span>
          )}
        </Nav.Link>
        <Nav.Link href="#profile" className="flex items-center ml-4">
          <FaUserCircle size="1.5em" />
        </Nav.Link>
        <Nav.Link href="#profile" className="flex items-center ml-4">
          <Button onClick={handleLogout}>Logout</Button>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default TopNavbar;
