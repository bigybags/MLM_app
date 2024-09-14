import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';
import '../../styles/successModal.css'; // Import custom CSS for additional styling

const OrderPlacedModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="bg-blue-100 text-center py-5">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="text-green-500" size={50} />
                </div>
                <h5 className="text-lg font-semibold text-gray-800">Order Placed Successfully</h5>
                <p className="text-gray-600 mt-2">Thank you for your order! You will receive an email confirmation shortly.</p>
            </Modal.Body>
            <Modal.Footer className="justify-center">
                <Button variant="primary" onClick={handleClose} className="bg-blue-500 hover:bg-blue-600">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderPlacedModal;
