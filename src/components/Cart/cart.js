import React, { useContext, useState } from 'react';
import { Modal, Button, Table, Toast, ToastContainer, Alert, Spinner } from 'react-bootstrap';
import { CartContext } from '../../context/cartcontext';
import Cookies from 'js-cookie';

const CartModal = ({ show, handleClose }) => {
  const { cartItems, addToCart, decrementQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [loading, setisLoading] = useState(false);

  const incrementQuantity = (item) => {
    addToCart(item);
  };

  const decrementQuantityHandler = (item) => {
    if (item.quantity > 1) {
      decrementQuantity(item.id);
    } else {
      removeFromCart(item.id);
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    const userId = Cookies.get('userId');
    setisLoading(true)
    if (!userId) {
      setToastMessage('User not authenticated.');
      setToastVariant('danger');
      setShowToast(true);
      return;
    }
  
    try {
      const orderData = {
        user: userId,
        total_amount: totalAmount.toFixed(2),
        order_details: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      console.log(orderData);
  
      const response = await fetch('https://mustafahasnain19.pythonanywhere.com/api/order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        setToastMessage('Order placed successfully!');
        setToastVariant('success');
        setShowToast(true);
        handleClose();
        clearCart();
        setisLoading(false);
      } else {
        const errorData = await response.json();
        setToastMessage(`Failed to place order: ${errorData.detail || 'Please try again.'}`);
        setToastVariant('danger');
        setShowToast(true);
        setisLoading(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setToastMessage('An error occurred. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
      setisLoading(false);
    }
  };

  return (
    <>
      <ToastContainer className="p-3" position="top-end">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length === 0 ? (
            <Alert variant="info">
              Your cart is empty. Add some items to the cart to view them here.
            </Alert>
          ) : (
            <>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>€{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>€{(item.price * item.quantity).toFixed(2)}</td>
                      <td className='d-flex gap-2'>
                        <Button variant="success" size="sm" onClick={() => incrementQuantity(item)}>+</Button>
                        <Button variant="danger" size="sm" onClick={() => decrementQuantityHandler(item)}>-</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-center">
                <h4 className='font-medium'>Total: €{totalAmount.toFixed(2)}</h4>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          {cartItems.length > 0 && (
            <Button variant="primary" onClick={handlePlaceOrder} disabled={loading}>
               {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="mr-2"
                />
              ) : null}
              Buy Now
              </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartModal;
