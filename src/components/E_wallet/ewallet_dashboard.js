import React, { useState, useEffect } from "react";
import { Tab, Nav, Row, Col, Container, Table, Spinner, Form } from 'react-bootstrap';
import InfoCard from "../info-card";
import Cookies from 'js-cookie';
import { API_URL } from "../../utils/config";


function Ewallet_Dashboard() {
    const [data, setData] = useState({
        credit: 0,
        debit: 0,
        transactions: [],
        payoutTransactions: [],
        remainingPoints: 0,
        commissionEarned: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filteredPayoutTransactions, setFilteredPayoutTransactions] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/transaction_dashboard/${userId}/`);
                if (response.ok) {
                    const result = await response.json();

                    const credit = result.transactions.reduce((acc, t) => acc + parseFloat(t.amount > 0 ? t.amount : 0), 0);
                    const debit = result.transactions.reduce((acc, t) => acc + parseFloat(t.amount < 0 ? t.amount : 0), 0);

                    const commissionEarned = result.transactions.filter(t => t.category && t.category.includes('Commission')).reduce((acc, t) => acc + parseFloat(t.amount), 0);

                    setData({
                        credit,
                        debit,
                        transactions: result.transactions,
                        payoutTransactions: result.payout_transactions,
                        remainingPoints: result.user_points.points,
                        commissionEarned,
                    });
                    setFilteredTransactions(result.transactions);
                    setFilteredPayoutTransactions(result.payout_transactions);
                    setIsLoading(false);
                } else {
                    console.error('Failed to fetch');
                }
            } catch (error) {
                console.error("Error fetching transaction dashboard data:", error);
            }
        };

        fetchData();
    }, [userId]);

    const handleDateFilter = (date) => {
        setFilterDate(date);
    
        const filteredTransactions = data.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.updated_at);
            return !isNaN(transactionDate) && transactionDate.toISOString().split('T')[0] === date;
        });
    
        const filteredPayoutTransactions = data.payoutTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.created_at);
            return !isNaN(transactionDate) && transactionDate.toISOString().split('T')[0] === date;
        });
    
        setFilteredTransactions(filteredTransactions);
        setFilteredPayoutTransactions(filteredPayoutTransactions);
    };

    if (isLoading) {
        return <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>;
    }

    return (
        <Container fluid >
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <InfoCard title="Credited" value={`£ ${data.credit.toFixed(2)}`} color="text-purple-600" />
                    <InfoCard title="Debited" value={`£ ${Math.abs(data.debit).toFixed(2)}`} color="text-red-600" />
                </div>
                <div className="bg-white mt-4 p-4 shadow">
                    <Tab.Container defaultActiveKey="transaction">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="transaction">Transactions</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="payout">Payout Transactions</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className="mt-4">
                            <Form.Group as={Col} controlId="filterDate" className="mb-4">
                                <Form.Label>Filter by Date</Form.Label>
                                <Form.Control type="date" value={filterDate} onChange={(e) => handleDateFilter(e.target.value)} />
                            </Form.Group>
                            <Tab.Pane eventKey="transaction">
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Transaction Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{transaction.transaction_id}</td>
                                                <td>£{parseFloat(transaction.amount).toFixed(2)}</td>
                                                <td>{transaction.status}</td>
                                                <td>{new Date(transaction.updated_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>
                            <Tab.Pane eventKey="payout">
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Points Redeemed</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Transaction Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayoutTransactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{transaction.transaction_id}</td>
                                                <td>{transaction.points_redeemed}</td>
                                                <td>£{parseFloat(transaction.amount).toFixed(2)}</td>
                                                <td>{transaction.status}</td>
                                                <td>{new Date(transaction.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>
        </Container>
    );
}

export default Ewallet_Dashboard;
