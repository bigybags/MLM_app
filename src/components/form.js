import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Col, Row, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { API_URL } from "../utils/config";


function MLMForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setisLoading] = useState(false)

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();
  const location = useLocation(); 


  useEffect(() => {
    // Initialize form values from cookies
    setEmail(Cookies.get('email') || '');
    setFirstName(Cookies.get('firstName') || '');
    setLastName(Cookies.get('lastName') || '');
    setPassword(Cookies.get('password') || '');
    setPhoneNo(Cookies.get('phoneNo') || '');
    setReferralCode(Cookies.get('referralCode') || '');

    const queryParams = new URLSearchParams(location.search);
    const ref = queryParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    } else {
      setReferralCode(Cookies.get('referralCode') || '');
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');

    if (refCode) {
      setReferralCode(refCode); // Update state instead of directly modifying the ref
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    const newErrors = {};
    if (!firstName) newErrors.firstName = true;
    if (!lastName) newErrors.lastName = true;
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;
    if (!phoneNo) newErrors.phoneNo = true;
    if (!referralCode) newErrors.referralCode = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setisLoading(false);
      return;
    }

    const formData = {
      referral_code: referralCode,
      email,
      phone_number: phoneNo
    };

    try {
      const response = await fetch(`${API_URL}/send_otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('OTP sent successfully:', result.message);
        Cookies.set('firstName', firstName);
        Cookies.set('lastName', lastName);
        Cookies.set('email', email);
        Cookies.set('password', password);
        Cookies.set('phoneNo', phoneNo);
        Cookies.set('referralCode', referralCode);
        navigate('/pin');
        setisLoading(false);
        setFormError('');
      } else {
        const result = await response.json();
        setFormError(result.message || 'An error occurred, please try again.');
        setisLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError('An error occurred, please try again.');
      setisLoading(false);

    }
  };

  return (
    <Form className="m-4 p-4" onSubmit={handleSubmit}>
      {formError && <Alert variant="danger">{formError}</Alert>}

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="firstName">
          <Form.Label className={errors.firstName ? 'text-danger' : ''}>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            isInvalid={errors.firstName}
          />
          <Form.Control.Feedback type="invalid">First name is required</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="lastName">
          <Form.Label className={errors.lastName ? 'text-danger' : ''}>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            isInvalid={errors.lastName}
          />
          <Form.Control.Feedback type="invalid">Last name is required</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label className={errors.email ? 'text-danger' : ''}>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={errors.email}
        />
        <Form.Control.Feedback type="invalid">Email address is required</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label className={errors.password ? 'text-danger' : ''}>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={errors.password}
        />
        <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="phoneNo">
        <Form.Label className={errors.phoneNo ? 'text-danger' : ''}>Phone Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Phone No."
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          isInvalid={errors.phoneNo}
        />
        <Form.Control.Feedback type="invalid">Phone number is required</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="referalCode">
        <Form.Label className="text-danger">Referral Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Referral Code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          isInvalid={errors.referralCode}
        />
        <Form.Control.Feedback type="invalid">Referral code is required</Form.Control.Feedback>
      </Form.Group>
      <Button
        type="submit"
        className="mt-2 w-100"
        variant="primary"
        disabled={loading} // Disable button when loading
      >
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
        Submit
      </Button>
      <div className="text-center mt-3">
        <a href="/login" className="text-decoration-none cursor-pointer hover:font-semibold transition-all">Already Registered? Login</a>
      </div>
    </Form>
  );
}

export default MLMForm;