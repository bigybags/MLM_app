import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
import OrderDetailsModal from './order_details_modal';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = Cookies.get('userId');
                const response = await fetch(`https://mustafahasnain19.pythonanywhere.com/api/orders/?user_id=${userId}`);

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
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrderDetails([]);
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
                                        <td>${order.total_amount}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                onClick={() => handleOrderDetails(order.order_details)}
                                            >
                                                Order Details
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
                show={showModal}
                handleClose={handleCloseModal}
                orderDetails={selectedOrderDetails}
            />
        </Container>
    );
};

export default Orders;
