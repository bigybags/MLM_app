// src/components/EarningsAndExpenses.js
import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

const EarningsAndExpenses = () => {
  const [activeTab, setActiveTab] = useState('earnings');

  const earningsData = [
    { label: 'Rank Bonus', amount: '€ 9.68' },
    { label: 'Referral', amount: '€ 62.12' },
    { label: 'Level Commission', amount: '€ 57.28' },
    { label: 'Vacation Fund', amount: '€ 1.61' },
    { label: 'Education Fund', amount: '€ 3.23' },
    { label: 'Car Fund', amount: '€ 7.26' },
  ];

  const expensesData = [
    // Add expenses data here if available
  ];

  return (
    <Card className="shadow rounded-lg p-4 mb-4">
      <Card.Header>
        <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
          <Nav.Item>
            <Nav.Link eventKey="earnings">Earnings</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="expenses">Expenses</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        {activeTab === 'earnings' && (
          <ul className="list-none p-0">
            {earningsData.map((item, index) => (
              <li key={index} className="flex justify-between py-1">
                <span>{item.label}</span>
                <span className="text-green-500">{item.amount}</span>
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'expenses' && (
          <ul className="list-none p-0">
            {expensesData.map((item, index) => (
              <li key={index} className="flex justify-between py-1">
                <span>{item.label}</span>
                <span className="text-red-500">{item.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};

export default EarningsAndExpenses;
