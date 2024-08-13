// src/components/ProfileForm.js
import React, { useState } from 'react';
import { Tab, Nav, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

const exampleProfile = {
  personalDetails: {
    firstName: 'John',
    lastName: 'Doe',
    dob: '1990-01-01',
  },
  contactDetails: {
    email: 'john.doe@example.com',
    phone: '+1234567890',
  },
  bankDetails: {
    bankName: 'Example Bank',
    accountNumber: '123456789',
    ifscCode: 'EXAMPL000123',
  },
  paymentDetails: {
    paypal: 'john.doe@example.com',
    venmo: '@johndoe',
  },
};

const ProfileForm = () => {
  const [profile, setProfile] = useState(exampleProfile);
  const [activeKey, setActiveKey] = useState('personalDetails');

  const handleInputChange = (section, field, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [section]: {
        ...prevProfile[section],
        [field]: value,
      },
    }));
  };

  return (
    <Row className="mt-4">
      <Col md={3}>
        <Nav variant="pills" className="flex-column" activeKey={activeKey} onSelect={(selectedKey) => setActiveKey(selectedKey)}>
          <Nav.Item>
            <Nav.Link eventKey="personalDetails">Personal Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="contactDetails">Contact Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bankDetails">Bank Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="paymentDetails">Payment Details</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col md={9}>
        <Tab.Content>
          <Tab.Pane eventKey="personalDetails">
            <h5 className="font-bold mb-4">Personal Details</h5>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.personalDetails.firstName}
                  onChange={(e) => handleInputChange('personalDetails', 'firstName', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formLastName" className="mt-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.personalDetails.lastName}
                  onChange={(e) => handleInputChange('personalDetails', 'lastName', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formDOB" className="mt-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={profile.personalDetails.dob}
                  onChange={(e) => handleInputChange('personalDetails', 'dob', e.target.value)}
                />
              </Form.Group>
            </Form>
          </Tab.Pane>
          <Tab.Pane eventKey="contactDetails">
            <h5 className="font-bold mb-4">Contact Details</h5>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={profile.contactDetails.email}
                  onChange={(e) => handleInputChange('contactDetails', 'email', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formPhone" className="mt-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.contactDetails.phone}
                  onChange={(e) => handleInputChange('contactDetails', 'phone', e.target.value)}
                />
              </Form.Group>
            </Form>
          </Tab.Pane>
          <Tab.Pane eventKey="bankDetails">
            <h5 className="font-bold mb-4">Bank Details</h5>
            <Form>
              <Form.Group controlId="formBankName">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.bankDetails.bankName}
                  onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAccountNumber" className="mt-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.bankDetails.accountNumber}
                  onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formIFSCCode" className="mt-3">
                <Form.Label>IFSC Code</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.bankDetails.ifscCode}
                  onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)}
                />
              </Form.Group>
            </Form>
          </Tab.Pane>
          <Tab.Pane eventKey="paymentDetails">
            <h5 className="font-bold mb-4">Payment Details</h5>
            <Form>
              <Form.Group controlId="formPaypal">
                <Form.Label>PayPal</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.paymentDetails.paypal}
                  onChange={(e) => handleInputChange('paymentDetails', 'paypal', e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formVenmo" className="mt-3">
                <Form.Label>Venmo</Form.Label>
                <Form.Control
                  type="text"
                  value={profile.paymentDetails.venmo}
                  onChange={(e) => handleInputChange('paymentDetails', 'venmo', e.target.value)}
                />
              </Form.Group>
            </Form>
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  );
};

export default ProfileForm;
