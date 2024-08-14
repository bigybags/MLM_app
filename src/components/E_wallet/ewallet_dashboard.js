import React, { useState } from "react";
// import ChartistGraph from "react-chartist";
// react-bootstrap components
import { Tab, Nav, Row, Col, Container, Table, Image } from 'react-bootstrap';

import Sidebar from "../sidebar";
import TopNavbar from "../navbar";
import "../../styles/dashboard.css";
import InfoCard from "../info-card";


function Ewallet_Dashbooard() {
    const eWalletSummaryData = {
        credit: {
            'Admin Credit': 0,
            'Payout Cancelled': 0,
            'Referral Commission': 3.83,
            'Level Commission': 2.3,
        },
        debit: {
            'Fund Debit Admin': 0,
            'Payout Requested': 0,
            'Payout Released (Manual)': 0,
            'Payout Fee': 0,
            'Fund Transfer Fee': 0,
            'Payout Release': 0,
            'Ewallet Payment': 0,
        },
    };
    const [data, setData] = useState(eWalletSummaryData);

    const transactionData = [
        {
            memberName: 'ru8pozbhc',
            category: 'Referral Commission',
            amount: 3.83,
            transactionDate: 'Aug 03, 2024, 01:52 AM',
        },
        {
            memberName: 'ru8pozbhc',
            category: 'Level Commission',
            amount: 2.3,
            transactionDate: 'Aug 03, 2024, 01:52 AM',
        },
    ];

    const balanceData = {
        memberName: 'ru8pozbhc',
        balance: 6.12,
        imagePath: '/mnt/data/image.png',
    };

    return (

        <Container fluid className="mt-2">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <InfoCard title="Credited" value="€ 6.12" color="text-purple-600" />
                    <InfoCard title="Debited" value="€ 0" color="text-green-600" />
                    <InfoCard title="E-Wallet Balance" value="€ 6.12" color="text-emerald-300" />
                    <InfoCard title="Purchase Wallet" value="€ 0.68" color="text-teal-400" />
                    <InfoCard title="Commission Earned" value="€ 6.80" color="text-blue-600" />
                </div>
                <div className="bg-white mt-4 p-4 shadow">
                    <Tab.Container defaultActiveKey="summary">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="summary">E-Wallet Summary</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="transaction">E-Wallet Transaction</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="balance">E-Wallet Balance</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="purchase">Purchase Wallet</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="statement">E-Wallet Statement</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="earnings">User Earnings</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className="mt-4">
                            <Tab.Pane eventKey="summary">
                                <Row>
                                    <Col md={6}>
                                        <h5 className="font-bold">Credit</h5>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {Object.entries(data.credit).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                                                >
                                                    <span className="text-gray-700">{key}</span>
                                                    <span className="text-green-500">€{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <h5 className="font-bold">Debit</h5>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {Object.entries(data.debit).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                                                >
                                                    <span className="text-gray-700">{key}</span>
                                                    <span className="text-red-500">€{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="transaction">
                                {/* <h5 className="font-bold">E-Wallet Transaction</h5> */}
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Member Name</th>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Transaction Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionData.map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{transaction.memberName}</td>
                                                <td>{transaction.category}</td>
                                                <td>€{transaction.amount}</td>
                                                <td>{transaction.transactionDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Tab.Pane>
                            <Tab.Pane eventKey="balance">
                                {/* <h5 className="font-bold">E-Wallet Balance</h5> */}
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Member Name</th>
                                            <th>E-Wallet Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {balanceData.memberName}
                                            </td>
                                            <td>€{balanceData.balance}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Tab.Pane>
                            <Tab.Pane eventKey="purchase">
                                <h5 className="font-bold">Purchase Wallet</h5>
                                {/* Add content for Purchase Wallet */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="statement">
                                <h5 className="font-bold">E-Wallet Statement</h5>
                                {/* Add content for E-Wallet Statement */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="earnings">
                                <h5 className="font-bold">User Earnings</h5>
                                {/* Add content for User Earnings */}
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>
        </Container>    
    );
}

export default Ewallet_Dashbooard;
