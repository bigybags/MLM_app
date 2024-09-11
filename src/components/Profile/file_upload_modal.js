import React, { useState } from 'react';
import { Modal, Button, Form, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { API_URL } from "../../utils/config";


const UploadModal = ({ show, handleClose, userId }) => {
  const [idProof, setIdProof] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === 'idProof') {
      setIdProof(file);
    } else if (e.target.name === 'addressProof') {
      setAddressProof(file);
    }
  };

  const validateForm = () => {
    if (!idProof || !addressProof) {
      setToastMessage('Both files (ID Proof and Address Proof) are required.');
      setToastVariant('danger');
      setShowToast(true);
      return false;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(idProof.type) || !allowedTypes.includes(addressProof.type)) {
      setToastMessage('Only PDF, JPG, and PNG files are allowed.');
      setToastVariant('danger');
      setShowToast(true);
      return false;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (idProof.size > maxSize || addressProof.size > maxSize) {
      setToastMessage('Files must be less than 5MB.');
      setToastVariant('danger');
      setShowToast(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('idProof', idProof);
    formData.append('addressProof', addressProof);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/upload_files/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setToastMessage('Files uploaded successfully!');
        setToastVariant('success');
      } else {
        setToastMessage('Failed to upload files.');
        setToastVariant('danger');
      }
    } catch (error) {
      setToastMessage('An error occurred during the upload.');
      setToastVariant('danger');
    }

    setLoading(false);
    setShowToast(true);
    handleClose();
  };

  return (
    <>
      <ToastContainer className="p-3" position="top-end">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please upload the following documents:</p>
          <ul>
            <li>Proof of ID (PDF, JPG, or PNG format, max 5MB)</li>
            <li>Proof of Address (PDF, JPG, or PNG format, max 5MB)</li>
          </ul>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formIdProof" className="mt-3">
              <Form.Label>Proof of ID</Form.Label>
              <Form.Control type="file" name="idProof" onChange={handleFileChange} required />
              <Form.Text className="text-muted">Upload a PDF, JPG, or PNG file (Max 5MB).</Form.Text>
            </Form.Group>
            <Form.Group controlId="formAddressProof" className="mt-3">
              <Form.Label>Proof of Address</Form.Label>
              <Form.Control type="file" name="addressProof" onChange={handleFileChange} required />
              <Form.Text className="text-muted">Upload a PDF, JPG, or PNG file (Max 5MB).</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Upload'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UploadModal;