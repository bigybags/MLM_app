import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Col, Row, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { API_URL } from "../utils/config";
import CustomNavbar from './CustomNavbar';


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
    <div>
      <div>
        <CustomNavbar />
      </div>
      <div className="flex justify-center items-center mt-[1%]">
        <Form className="bg-white p-6 rounded-lg w-96" onSubmit={handleSubmit}>
          <h2 className="text-center text-xl font-semibold mb-4">Sign up</h2>

          {formError && <Alert variant="danger">{formError}</Alert>}
          <Row>
            <Col>
              <Form.Group controlId="firstName" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  isInvalid={errors.firstName}
                  className="rounded-full bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white"
                />
                <Form.Control.Feedback type="invalid">First name is required</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lastName" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  isInvalid={errors.lastName}
                  className="rounded-full bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white"
                />
                <Form.Control.Feedback type="invalid">Last name is required</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>


          <Form.Group controlId="email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={errors.email}
              className="rounded-full bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white"
            />
            <Form.Control.Feedback type="invalid">Email address is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="phoneNo" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Phone Number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              isInvalid={errors.phoneNo}
              className="rounded-full bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white"
            />
            <Form.Control.Feedback type="invalid">Phone number is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password" className="mb-3 relative">
            <Form.Control
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={errors.password}
              className="rounded-full bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white"
            />
            <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
            {/* Add icon inside the input */}
            {/* <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">👁️</span> */}
          </Form.Group>

          <Form.Group controlId="referralCode" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Referral Code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              isInvalid={errors.referralCode}
              className="rounded-full bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white"
            />
            <Form.Control.Feedback type="invalid">Referral code is required</Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            className="w-full py-2 mt-3 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition-all"
            variant="primary"
            disabled={loading}
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
            ) : 'Sign up'}
          </Button>

          <div className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default MLMForm;