import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Table } from 'react-bootstrap';
import { API_URL } from "../../utils/config";


const OrderTrackingModal = ({ show, handleClose, orderId }) => {
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && orderId) {
            fetchOrderTracking();
        }
    }, [show, orderId]);

    const fetchOrderTracking = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/order_tracking/${orderId}/`);
            if (response.ok) {
                const data = await response.json();
                setTrackingData(data);
            } else {
                setError("Tracking info not available.");
            }
        } catch (err) {
            setError("An error occurred while fetching the tracking data.");
        } finally {
            setLoading(false);
        }
    };

    if (!trackingData && !loading) {
        return <Spinner size='sm'></Spinner>; // Ensures the component does not render if tracking data is not available
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Order Tracking</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {loading ? (
                    <div className="text-center"><Spinner size='sm' animation="border" /></div>
                ) : error ? (
                    <div className="text-center text-danger">{error}</div>
                ) : trackingData ? (
                    <div className="space-y-4">
                        <div className="font-semibold mb-2">Order ID: {orderId}</div>
                        <div className="mb-4">
                            <h6 className="font-semibold">Package Details</h6>
                            <div><strong>Tracking Number:</strong> {trackingData.tracking_number}</div>
                            <div><strong>Status:</strong> {trackingData.status}</div>
                            <div><strong>Estimated Delivery:</strong> {trackingData.estimated_delivery}</div>
                        </div>
                        <div className="mb-4">
                            <h6 className="font-semibold">Products in Order</h6>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trackingData.order_details.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{detail.product_name}</td>
                                            <td>{detail.quantity}</td>
                                            <td>£{detail.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <h6 className="font-semibold">Shipping Details</h6>
                            {trackingData.shipping_details && trackingData.shipping_details.length > 0 ? (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trackingData.shipping_details.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{detail.status}</td>
                                                <td>{detail.timestamp}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <div>No shipping details available.</div>
                            )}
                        </div>
                    </div>
                ) : null}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderTrackingModal;
