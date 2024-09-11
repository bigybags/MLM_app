import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Table, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { CartContext } from '../../context/cartcontext';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ show, handleClose }) => {
  const { cartItems, addToCart, decrementQuantity, removeFromCart, cartErrors } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [showToasts, setShowToasts] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(cartErrors).length > 0) {
      setShowToasts(true);
    }
  }, [cartErrors]);

  const incrementQuantity = (item) => addToCart(item);

  const decrementQuantityHandler = (item) => {
    if (item.quantity > 1) {
      decrementQuantity(item.id);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleNavigate = () => {
    handleClose();
    navigate("/dashboard/checkout");
  };

  return (
    <>
      {/* Overlay for backdrop effect */}
      {show && (
        <div
          className="fixed inset-0 bg-opacity-70 z-[999] transition-opacity duration-300 ease-in-out"
          onClick={handleClose} // Clicking outside the modal closes it
        ></div>
      )}

      {/* Modal itself */}
      <div
        className={`fixed inset-y-0 top-[10%] right-0 z-[1000] bg-white w-96 lg:w-96 p-4 shadow-lg transform ${show ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between pb-4 border-b">
          <h5 className="font-semibold text-lg">Bigy Bags</h5>
          <Button variant="link" onClick={handleClose} className="text-dark">
            &times;
          </Button>
        </div>

        <div className="py-4">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : cartItems.length === 0 ? (
            <Alert variant="info">Your cart is empty. Add some items to view them here.</Alert>
          ) : (
            <div className="h-[300px] overflow-auto custom-scrollbar scroll-smooth">
              <Table responsive className="text-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                {/* Scrollable tbody */}
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index} className="table-row">
                      <td className="align-middle">{item.name}</td>
                      <td className="align-middle">£{item.price}</td>
                      <td className="align-middle">{item.quantity}</td>
                      <td className="align-middle">£{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="align-middle">
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => incrementQuantity(item)}
                            disabled={loading}
                          >
                            +
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => decrementQuantityHandler(item)}
                            disabled={loading}
                          >
                            -
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-4 text-center">
              <h4 className="font-bold">
                Total: £
                {cartItems
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toFixed(2)}
              </h4>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center border-t pt-4 align-bottom">
          <Button variant="secondary" onClick={handleClose}>
            Add items
          </Button>
          <Button
            variant="success"
            onClick={handleNavigate}
            disabled={cartItems.length === 0}
          >
            Go to Checkout
          </Button>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="bottom-end" className="p-3">
        {Object.entries(cartErrors).map(([productId, error], index) => (
          error && (
            <Toast
              key={index}
              bg="danger"
              onClose={() => setShowToasts(false)}
              show={showToasts}
              delay={5000}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body>{error}</Toast.Body>
            </Toast>
          )
        ))}
      </ToastContainer>
    </>
  );
};

export default CartModal;
