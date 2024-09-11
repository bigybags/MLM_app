import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartErrors, setCartErrors] = useState({});

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const existingProduct = cartItems.find(item => item.id === product.id);
    const quantityInCart = existingProduct ? existingProduct.quantity : 0;
    const totalQuantity = quantityInCart + 1;

    if (totalQuantity > product.items_in_stock) {
      setCartErrors({ [product.id]: `Only ${product.items_in_stock} items in stock.` });
    } else {
      if (existingProduct) {
        setCartItems(cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: totalQuantity } : item
        ));
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
      setCartErrors({}); // Clear any existing errors
    }
  };

  const decrementQuantity = (productId) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === productId
        ? item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : null
        : item
    ).filter(item => item !== null);

    setCartItems(updatedCartItems);
  };

  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, decrementQuantity, removeFromCart, clearCart, cartErrors }}>
      {children}
    </CartContext.Provider>
  );
};
