import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
import OrderDetailsModal from './order_details_modal';
import OrderTrackingModal from './order_tracking';
import { API_URL } from "../../utils/config";


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
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

    const handleOrderDetails = (orderDetails) => {
        setSelectedOrderDetails(orderDetails);
        setShowDetailsModal(true);
    };

    const handleOrderTracking = (orderId) => {
        setSelectedOrderId(orderId);
        setShowTrackingModal(true);
    };

    return (
        <Container fluid>
            <Row className="mt-4">
                <Col>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    ) : error ? (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    ) : orders.length === 0 ? (
                        <p>No orders have been placed yet.</p>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User ID</th>
                                    <th>Total Amount</th>
                                    <th>Order Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.user}</td>
                                        <td>£{order.total_amount}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="d-flex gap-2">
                                            <Button
                                                variant="info"
                                                onClick={() => handleOrderDetails(order.order_details)}
                                            >
                                                Order Details
                                            </Button>
                                            <Button
                                                variant="warning"
                                                onClick={() => handleOrderTracking(order.id)}
                                            >
                                                Track Order
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>

            {/* Order Details Modal */}
            <OrderDetailsModal
                show={showDetailsModal}
                handleClose={() => setShowDetailsModal(false)}
                orderDetails={selectedOrderDetails}
            />

            {/* Order Tracking Modal */}
            <OrderTrackingModal
                show={showTrackingModal}
                handleClose={() => setShowTrackingModal(false)}
                orderId={selectedOrderId}
            />
        </Container>
    );
};

export default Orders;
