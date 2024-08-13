// src/App.js
import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import MLMForm from './components/form';
import LoginForm from './components/login';
import Dashboard from './components/dashboard';
import NetworkDashboard from './components/network/networkDashboard';
import ProductDashboard from './components/Products/Product_Dashboard';
import Ewallet_Dashboard from './components/E_wallet/ewallet_dashboard';
import ProfileDashboard from './components/Profile/profile_dashboard';
import Sidebar from './components/sidebar';
import TopNavbar from './components/navbar';
import CartModal from './components/Cart/cart';
import { CartProvider } from './context/cartcontext';
import './App.css';
import AuthLayout from './components/Auth_layout';
import DashboardLayout from './components/dashboard_layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import Orders_dashboard from './components/Orders/order_dashboard';
import PinConfirmation from './components/Pin';


function App() {
  const [showCart, setShowCart] = useState(false);

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  return (
    <Routes>
    {/* Authentication Routes */}
    <Route path="/" element={<AuthLayout />}>
      <Route path="/" element={<MLMForm />} />
      <Route path="/pin" element={<PinConfirmation />} />
      <Route path="/login" element={<LoginForm />} />
    </Route>

    {/* Dashboard Routes */}
    <Route path="/dashboard" element={<DashboardLayout handleShowCart={handleShowCart} showCart={showCart} handleCloseCart={handleCloseCart} />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="network" element={<NetworkDashboard />} />
      <Route path="products" element={<ProductDashboard />} />
      <Route path="ewallet" element={<Ewallet_Dashboard />} />
      <Route path="profile" element={<ProfileDashboard />} />
      <Route path="orders" element={<Orders_dashboard />} />
    </Route>
  </Routes>
  );
}

export default App;
