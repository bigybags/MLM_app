import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { API_URL } from "../../utils/config";
import Cookies from 'js-cookie';
import { Spinner } from 'react-bootstrap';
import dayjs from 'dayjs'; // Import dayjs for date formatting

const PurchasesLineGraph = () => {
    const [graphData, setGraphData] = useState({ user_purchases: [], referral_purchases: [] });
    const [loading, setLoading] = useState(true);
    const userId = Cookies.get('userId');

    useEffect(() => {
        // Fetch purchases data from the API
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/get_graph_data/${userId}`);
                const data = await response.json();

                // Sort and format data
                const sortedUserPurchases = data.user_purchases.sort((a, b) => new Date(a.date) - new Date(b.date));
                const sortedReferralPurchases = data.referral_purchases.sort((a, b) => new Date(a.date) - new Date(b.date));

                // Add referral names to referral purchases
                const formattedReferralPurchases = sortedReferralPurchases.map(purchase => ({
                    ...purchase,
                    referral_name: purchase.user
                }));

                setGraphData({
                    user_purchases: sortedUserPurchases,
                    referral_purchases: formattedReferralPurchases
                });
                console.log({
                    user_purchases: sortedUserPurchases,
                    referral_purchases: formattedReferralPurchases
                })
            } catch (error) {
                console.error('Error fetching graph data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // Format the date on the X-axis
    const formatXAxis = (tickItem) => dayjs(tickItem).format('MMM DD, YYYY');

    // Render loading spinner if data is being fetched
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            {/* User Purchases Graph */}
            <div className="mb-4" style={{ position: 'relative' }}>
                <h3>User Purchases</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={graphData.user_purchases}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" tickFormatter={formatXAxis} />
                        <YAxis />
                        <Tooltip content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const { user, amount } = payload[0].payload;
                                return (
                                    <div className="custom-tooltip">
                                        <p>{`User: ${user}`}</p>
                                        <p>{`Amount: £${amount}`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }} />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" dot={true} />
                    </LineChart>
                </ResponsiveContainer>
                {graphData.user_purchases.length === 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'red',
                        fontWeight: 'bold'
                    }}>
                        No user purchases done yet.
                    </div>
                )}
            </div>

            {/* Referral Purchases Graph */}
            <div style={{ position: 'relative' }}>
                <h3>Referral Purchases</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={graphData.referral_purchases}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" tickFormatter={formatXAxis} />
                        <YAxis />
                        <Tooltip content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const { referral_name, amount } = payload[0].payload;
                                return (
                                    <div className="custom-tooltip">
                                        <p>{`Referral: ${referral_name}`}</p>
                                        <p>{`Amount: £${amount}`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }} />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#82ca9d" dot={true} />
                    </LineChart>
                </ResponsiveContainer>
                {graphData.referral_purchases.length === 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'red',
                        fontWeight: 'bold'
                    }}>
                        No referral purchases done yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchasesLineGraph;
