import React, { useState } from 'react';
import Sidebar from './sidebar';
import TopNavbar from './navbar';
import CartModal from './Cart/cart';
import { Outlet } from 'react-router-dom';
import { useAuth } from './Auth/useAuth';

const DashboardLayout = ({ handleShowCart, showCart, handleCloseCart }) => {
  useAuth() // Use the authentication hook to protect routes

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <TopNavbar toggleSidebar={toggleSidebar} handleShowCart={handleShowCart} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setOpen={setIsSidebarOpen} />

      {/* Main content */}
      <div className="pt-16">
        <Outlet />
      </div>

      {/* Cart modal */}
      <CartModal show={showCart} handleClose={handleCloseCart} />
    </div>
  );
};

export default DashboardLayout;
