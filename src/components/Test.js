import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

const LoanForm = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log({
      loanAmount,
      businessName,
      name,
      email,
      phone,
      consent,
    });
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Apply for a Business Loan</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLoanAmount">
              <Form.Label>Loan Amount (£)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="600,000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBusinessName" className="mt-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formName" className="mt-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formConsent" className="mt-3">
              <Form.Check
                type="checkbox"
                label="I agree to the terms and conditions"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
              Get Your Loan Quote
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoanForm;
