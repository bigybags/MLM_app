// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get('userId');

    if (!userId) {
      navigate('/login'); // Redirect to login if userId cookie is not found
    }
  }, [navigate]);
};

export default useAuth;
