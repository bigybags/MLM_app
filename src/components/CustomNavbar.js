import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const navigate = useNavigate()
  return (
    <Navbar className="bg-white shadow-sm px-4 py-2 flex justify-between items-center">
      {/* Logo Section */}
      <Navbar.Brand href="#">
        <img
          src="//bigybags.com/cdn/shop/files/Bigy_Bags-logo_300x300.png?v=1649403703" // Replace with your logo path
          alt="Bigy Bag Logo"
          className="h-10" // Adjust the height as needed
        />
      </Navbar.Brand>

      {/* Right Side (Sign In / Sign Up) */}
      <Nav className="flex items-center">
        <Button
          variant="light"
          className="text-black mr-2 rounded-full px-4 py-1 hover:bg-gray-100"
          onClick={()=>(navigate("/login"))}
        >
          Sign in
        </Button>
        <Button
          variant="dark"
          className="rounded-full px-4 py-1 hover:bg-gray-800"
          onClick={()=>(navigate("/"))}
        >
          Sign up
        </Button>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
