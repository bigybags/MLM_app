import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Toast, ToastContainer, Container, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
import InfoCard from '../info-card';
import { API_URL } from "../../utils/config";


const RedeemPoints = () => {
    const [points, setPoints] = useState(0);
    const [redeemPoints, setRedeemPoints] = useState(0);
    const [paypalEmail, setPaypalEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('info');
    const [moneyEquivalent, setMoneyEquivalent] = useState(0);
    const [balance, setBalance] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const userId = Cookies.get('userId');

    // Fetch eWallet balance
    useEffect(() => {
        const fetchEwalletBalance = async () => {
            try {
                const response = await fetch(`${API_URL}/ewallet/${userId}/`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setBalance(data.balance);

                    // Show alert if balance is 0
                    if (data.balance === 0) {
                        setShowAlert(true);
                    }
                } else if (response.status === 404 || balance === 0) {
                    setShowAlert(true);
                } else {
                    setToastMessage('Failed to fetch eWallet balance.');
                    setToastVariant('danger');
                    setShowToast(true);
                }
            } catch (error) {
                setToastMessage('An error occurred while fetching eWallet balance.');
                setToastVariant('danger');
                setShowToast(true);
                console.log(error);
            }
        };
        fetchEwalletBalance();
    }, [userId, balance]);

    // Fetch user points
    useEffect(() => {
        const fetchUserPoints = async () => {
            try {
                const response = await fetch(`${API_URL}/user_points/?user_id=${userId}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setPoints(data.points);
                } else {
                    setToastMessage('Failed to fetch user points.');
                    setToastVariant('danger');
                    setShowToast(true);
                }
            } catch (error) {
                setToastMessage('An error occurred while fetching points.');
                setToastVariant('danger');
                setShowToast(true);
                console.log(error);
            }
        };
        fetchUserPoints();
    }, [userId]);

    // Calculate money equivalent based on points
    useEffect(() => {
        const pointToMoneyRate = 0.01; // Define your conversion rate
        setMoneyEquivalent(redeemPoints * pointToMoneyRate);
    }, [redeemPoints]);

    const handleRedeem = async () => {
        if (redeemPoints <= 0 || redeemPoints > points) {
            setToastMessage("Invalid points input.");
            setToastVariant("danger");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/redeem_points/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    points: redeemPoints,
                    paypal_email: paypalEmail
                })
            });

            if (response.ok) {
                setToastMessage("Points redeemed successfully!");
                setToastVariant("success");
                // Update points after redemption
                setPoints(points - redeemPoints);
                setRedeemPoints(0);
                setPaypalEmail('');
            } else {
                setToastMessage("Error redeeming points. Please try again.");
                setToastVariant("danger");
            }
        } catch (error) {
            setToastMessage("An error occurred. Please try again.");
            setToastVariant("danger");
        } finally {
            setShowToast(true);
            setLoading(false);
        }
    };

    return (
        <>
            <Container fluid className="p-4">
                <h2 className="mb-4 text-center font-semibold">Cash Withdraw</h2>

                {showAlert && (
                    <Alert variant="warning" className="text-center">
                        Your Ewallet Balance is zero. You will get balance each month based on your commission.
                    </Alert>
                )}

                {!showAlert && (
                    <>
                        <div className='w-full flex justify-center'>
                            <div className='w-[20%]'>
                                <InfoCard title="Total Points" value={points} color="text-purple-600" />
                            </div>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='w-[50%] mt-4'>
                                <Form.Group className="mb-3">
                                    <Form.Label className="font-semibold">Cash to Withdraw</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={redeemPoints}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setRedeemPoints(value);
                                            // Recalculate money equivalent and update the points left
                                            setMoneyEquivalent(value * 0.01);
                                        }}
                                        max={points}
                                        min={0}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>PayPal Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="mb-3">
                                    <strong>Money Equivalent: </strong>£{moneyEquivalent.toFixed(2)}
                                </div>
                                <Button onClick={handleRedeem} disabled={loading} variant="primary">
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Redeem'}
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {/* Bootstrap Toast for Notifications */}
                <ToastContainer position="top-end" className="p-3">
                    <Toast
                        onClose={() => setShowToast(false)}
                        show={showToast}
                        bg={toastVariant}
                        delay={3000}
                        autohide
                    >
                        <Toast.Header>
                            <strong className="me-auto">Notification</strong>
                        </Toast.Header>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Container>
        </>
    );
};

export default RedeemPoints;
