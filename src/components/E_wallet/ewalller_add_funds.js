import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Cookies from 'js-cookie';
import { API_URL } from "../../utils/config";



const Ewallet = () => {
    const [amount, setAmount] = useState(0);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');

    const userId = Cookies.get('userId');

    const handlePaymentSuccess = async (data, actions) => {
        try {
            const response = await fetch(`${API_URL}/add_funds/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    amount: amount
                })
            });

            const result = await response.json();
            if (response.ok) {
                setBalance(result.balance);
                setError('');
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred, please try again.');
        }
    };

    return (
        <div className="ewallet-container">
            <h2>Your eWallet</h2>
            <div>
                <label>Amount: </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-control"
                />
            </div>
            <div>
                <PayPalScriptProvider options={{ "client-id": "AcfZegwsJHjZkBYFKkSAsNWTRDS3xF_7jjEr-bjMTxROkAj6Nlg1HVXyzIWIFb7Iujtex-uSMM_yTA1H" }}>
                    <PayPalButtons
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: `5.00`, // Set a fixed value for testing
                                    },
                                }],
                            });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                                console.log('Transaction completed by ' + details.payer.name.given_name);
                            });
                        }}
                    />
                </PayPalScriptProvider>

            </div>
            {balance !== null && (
                <div>
                    <h3>Updated Balance: ${balance}</h3>
                </div>
            )}
            {error && (
                <div>
                    <h3 className="text-danger">{error}</h3>
                </div>
            )}
        </div>
    );
};

export default Ewallet;
