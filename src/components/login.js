import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Make sure to install this package
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';

function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
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
        
        // Navigate to the dashboard
        navigate("/dashboard/dashboard");
      } else {
        // Handle login failure
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4 text-2xl font-bold">Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                ref={emailRef}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                ref={passwordRef}
                required
              />
            </Form.Group>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            <Button variant="primary" type="submit" className="mt-3 w-100">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <a href="/" className="text-decoration-none">Not Registered? Sign Up</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
