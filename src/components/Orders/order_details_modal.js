import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { API_URL } from '../../utils/config';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = Cookies.get('userId');
        const response = await fetch(`${API_URL}/orders/?user_id=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderTracking = (orderId) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : orders.length === 0 ? (
            <p>No orders have been placed yet.</p>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="mb-4 shadow-sm">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Order Number {order.id}</strong>
                  </div>
                  <div className="text-lg-right">
                    <strong>Total Amount: £{order.total_amount}</strong>
                    <Button
                      variant="outline-primary"
                      className="ml-3"
                      onClick={() => handleOrderTracking(order.id)}
                    >
                      Track Order
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="bg-white">
                  {order.order_details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap mb-3 p-2 border-b border-gray-200"
                    >
                      <Row className="w-full items-center">
                        <Col xs={12} md={2} className="flex justify-center">
                          <img
                            src={detail.product.image_url}
                            alt={detail.product.name}
                            className="max-w-full h-auto rounded-lg"
                            style={{ width: '100px', height: '100px' }}
                          />
                        </Col>
                        <Col xs={12} md={6} className="flex flex-col">
                          <h6>{detail.product.name}</h6>
                          <p className="text-muted">{order.address_line_1}, {order.city}, {order.state}, {order.country}</p>
                        </Col>
                        <Col xs={12} md={2} className="text-center">
                          <p>£{detail.price}</p>
                        </Col>
                        <Col xs={12} md={2} className="text-center">
                          <p>QTY: {detail.quantity}</p>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>

      {/* Order Tracking Modal */}
      {/* <OrderTrackingModal
        show={showTrackingModal}
        handleClose={() => setShowTrackingModal(false)}
        orderId={selectedOrderId}
      /> */}
    </Container>
  );
};

export default Orders;
