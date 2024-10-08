import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../utils/config";

const PinConfirmation = () => {
    const [pin, setPin] = useState(new Array(4).fill(''));
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const inputRefs = useRef([]);
    const email = Cookies.get('email'); // Assuming the email is stored in cookies
    const firstName = Cookies.get('firstName');
    const lastName = Cookies.get('lastName');
    const password = Cookies.get('password');
    const phoneNo = Cookies.get('phoneNo');
    const referralCode = Cookies.get('referralCode');

    useEffect(() => {
        // Check if any cookie is missing
        if (!email || !firstName || !lastName || !password || !phoneNo || !referralCode) {
            // Redirect to home page if any cookie is missing
            navigate('/');
            return;
        }
    }, [navigate]);

    const removeAllCookies = () => {
        // Remove all cookies
        Cookies.remove('email');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('password');
        Cookies.remove('phoneNo');
        Cookies.remove('referralCode');
    };

    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    const handleChange = (value, index) => {
        if (/^\d?$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (value !== '' && index < 3) {
                inputRefs.current[index + 1].focus();
            } else if (value === '' && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const register_user = async () => {
        setShowToast(false);

        const formData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone_no: phoneNo,
            referral_code: referralCode
        };
        try {
            const response = await fetch(`${API_URL}/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('User added successfully');
                removeAllCookies(); // Remove all cookies on success
                setToastMessage('Email Verified');
                setToastVariant('success');
                setShowToast(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000); // Redirect after 2 seconds
            } else {
                const result = await response.json();
                if (result.error) {
                    setToastMessage('An error occurred in Registration. Please try again.');
                    setToastVariant('danger');
                }
                console.error('Error adding user');
            }
        } catch (error) {
            setToastMessage('An error occurred in Registration. Please try again.');
            setToastVariant('danger');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (pin.some(digit => digit === '')) {
            setToastMessage('Please fill all PIN fields.');
            setToastVariant('danger');
            setShowToast(true);
            return;
        }

        setLoading(true); // Start loading

        try {
            const response = await fetch(`${API_URL}/verify_otp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp: pin.join(''),
                }),
            });

            if (response.ok) {
                setToastMessage('OTP verified successfully!');
                setToastVariant('success');
                setShowToast(true);
                register_user();
            } else {
                const errorData = await response.json();
                setToastMessage(`Failed to verify OTP: ${errorData.detail || 'Please try again.'}`);
                setToastVariant('danger');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setToastMessage('An error occurred. Please try again.');
            setToastVariant('danger');
            setShowToast(true);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <ToastContainer className="p-3" position="top-end">
                <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Row className="justify-content-center">
                <Col md={6} xs={10}>
                    <h3 className="text-center mb-4 font-semibold text-2xl">Email Confirmation</h3>
                    <p className="text-center mb-4 font-medium text-base">An OTP has been sent to your email. Please check your inbox and enter the code to proceed.</p>
                    <Form onSubmit={handleSubmit}>
                        <Row className="justify-content-center">
                            {pin.map((value, index) => (
                                <Col key={index} xs={3} md={2} className="mb-4">
                                    <Form.Control
                                        type="text"
                                        maxLength="1"
                                        value={value}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className="text-center"
                                        style={{ border: '1px solid #333333' }}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <div className="text-center">
                            <Button
                                type="submit"
                                className="mt-2"
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
                        </div>
                    </Form>
                    <div className="text-center mt-3">
                        <div onClick={() => navigate("/")} className="hover:font-semibold hover:underline cursor-pointer transition-all">Didn't Receive OTP? Go Back</div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PinConfirmation;
