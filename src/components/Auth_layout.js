// src/components/AuthLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from './Auth/useAuth';


const AuthLayout = () => {

  return (
    <div className="auth-container">
      <Outlet /> {/* This is where the nested routes for auth pages will be rendered */}
    </div>
  );
};

export default AuthLayout;
