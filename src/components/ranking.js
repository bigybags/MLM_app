// src/components/Ranking.js
import React, { useState, useEffect } from 'react';
import { Card, Nav, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

const Ranking = ({ userId }) => {
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user_points/?user_id=${userId}`); // Replace '1' with the actual user ID
        if (!response.ok) {
          throw new Error('Failed to fetch ranking and points');
        }
        const data = await response.json();
        setPoints(data);
        console.log('memebers', data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);
  if (loading) {
    return (
      <Spinner size='sm'></Spinner>
    )
  }
  return (
    <div className='flex gap-4'>
      <Card className="shadow rounded-lg p-4 mb-4">
        <Card.Header>
          {/* <Nav variant="tabs" defaultActiveKey="#rank">
            <Nav.Item>
              <Nav.Link href="#rank">Rank</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#rank-overview">Rank Overview</Nav.Link>
            </Nav.Item>
          </Nav> */}
        </Card.Header>
        <Card.Body className="flex flex-col items-center">
          <div className="text-6xl mb-4">🏅</div>
          <h5 className="font-bold">Current Ranking</h5>
          <p className="text-xl">{points.status}</p>
        </Card.Body>
      </Card>
      <Card className="shadow rounded-lg p-4 mb-4">
        <Card.Header>
          {/* <Nav variant="tabs" defaultActiveKey="#rank">
            <Nav.Item>
              <Nav.Link href="#rank">Points</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#rank-overview">Rank Overview</Nav.Link>
            </Nav.Item>
          </Nav> */}
        </Card.Header>
        <Card.Body className="flex flex-col items-center">
          <div className="text-6xl mb-4">🏅</div>
          <h5 className="font-bold">Points</h5>
          <p className="text-xl">{points.points}</p>
        </Card.Body>
      </Card>
    </div>

  );
};

export default Ranking;
