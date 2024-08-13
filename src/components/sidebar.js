import React, { useState, useEffect } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';


const Sidebar = () => {

    const location = useLocation();
    const [activePath, setActivePath] = useState('/');
    const navigate = useNavigate()
  
    useEffect(() => {
      setActivePath(location.pathname);
    }, [location]);

   
  
    const isActive = (path) => {
      return activePath === path ? 'bg-blue-100 text-blue-600 font-bold' : 'text-blue-700 font-medium';
    };
    

  return (
    <div className='Poppins' style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#072342" backgroundColor="">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/dashboard/dashboard" className="text-decoration-none" style={{ color: 'inherit' }}>
            <img src="//bigybags.com/cdn/shop/files/Bigy_Bags-logo_300x300.png?v=1649403703" alt='Biggy Bags' className='w-[25%] absolute top-[1%]'></img>
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu> 
            <NavLink exact to="/dashboard/dashboard"  className={`flex items-center hover:bg-gray-200 rounded-lg ${isActive('/dashboard/dashboard')}`} >
              <CDBSidebarMenuItem icon="th-large">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/dashboard/network" className={`flex items-center hover:bg-gray-200 rounded-lg ${isActive('/dashboard/network')}`} >
              <CDBSidebarMenuItem icon="sitemap">Network</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/dashboard/products" className={`flex items-center hover:bg-gray-200 rounded-lg ${isActive('/dashboard/products')}`}>
              <CDBSidebarMenuItem icon="sticky-note">Products</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/dashboard/ewallet" className={`flex items-center hover:bg-gray-200 rounded-lg ${isActive('/dashboard/ewallet')}`} >
              <CDBSidebarMenuItem icon="wallet">E Wallet</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/dashboard/profile" className={`flex items-center hover:bg-gray-200 rounded-lg ${isActive('/dashboard/profile')}`} >
              <CDBSidebarMenuItem icon="user">Profile</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/dashboard/orders" className={`flex items-center hover:bg-gray-200 rounded-lg ${isActive('/dashboard/orders')}`} >
              <CDBSidebarMenuItem icon="user">Orders</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;