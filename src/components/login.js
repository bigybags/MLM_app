import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Make sure to install this package
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { API_URL } from "../utils/config";
import Banner from './Banner';
import CustomNavbar from './CustomNavbar';


function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setisLoading(true)
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError('Please fill in both fields.');
      setisLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Parse JSON response to get user ID
        const data = await response.json();
        const userId = data.user_id;

        // Set user ID as a cookie
        Cookies.set('userId', userId, { expires: 7 });

        // Clear any previous errors
        setError('');
        console.log('Login successful');
        setisLoading(false)
        // Navigate to the dashboard
        navigate("/dashboard/dashboard");
      } else {
        // Handle login failure
        setError('Invalid email or password');
        setisLoading(false)
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
      setisLoading(false)
    }
  };

  return (
    <div fluid>
      <div>
        <CustomNavbar />
      </div>
      <div>
        <Banner />
      </div>

      <Row className="justify-content-center">
        <Col md={5} lg={3}>
          <h2 className="text-center mb-4 text-2xl font-semibold">Sign in</h2>
          <Form onSubmit={handleLogin} className='w-full'>
            <Form.Group controlId="formBasicEmail" className='space-y-5 '>
              <Form.Control
                type="email"
                className='rounded-3xl bg-[#F0F0F0]'
                placeholder="Enter your email"
                ref={emailRef}
                required
              />
              <Form.Control
                type="password"
                className='rounded-3xl bg-[#F0F0F0]'
                placeholder="Enter your password"
                ref={passwordRef}
                required
              />
            </Form.Group>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            <Button variant="primary" type="submit" className="mt-3 w-100 rounded-3xl bg-[#001B36] text-white" disabled={loading}>
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
              Sign in
            </Button>
          </Form>
          <div className="text-center mt-[10%] justify-center border-t-[1px] border-t-black pt-[10%]">
            <p className="text-decoration-none cursor-pointer">Do not have account?</p>
            <Button className='bg-white text-[#1E1E1E] rounded-3xl w-full border border-black' onClick={()=>{navigate("/")}}>Sign up</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default LoginForm;
