// src/components/DashboardLayout.js
import React from 'react';
import Sidebar from './sidebar';
import TopNavbar from './navbar';
import CartModal from './Cart/cart';
import { Outlet } from 'react-router-dom';
import useAuth from './Auth/useAuth';


const DashboardLayout = ({ handleShowCart, showCart, handleCloseCart }) => {
    useAuth(); // Use the hook to handle redirection

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <TopNavbar handleShowCart={handleShowCart} />
        <Outlet /> {/* This is where the nested routes will be rendered */}
        <CartModal show={showCart} handleClose={handleCloseCart} />
      </div>
    </div>
  );
};

export default DashboardLayout;
