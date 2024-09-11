// src/components/Ranking.js
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';
import bronzeMedal from '../assets/medals/bronze.jpeg';
import NoPinMedal from '../assets/medals/nopin.jpeg';
import silverMedal from '../assets/medals/silver.jpeg';
import goldMedal from '../assets/medals/Gold.jpeg';
import emeraldMedal from '../assets/medals/Emerald.jpeg';
import diamondMedal from '../assets/medals/diamond.jpeg';
import ambassadorMedal from '../assets/medals/bronze.jpeg';
import { API_URL } from "../utils/config";


const Ranking = ({ userId }) => {
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const medals = ['Silver', 'Gold', 'Emerald', 'Diamond', 'Ambassador'];
  
  // Define the medals with corresponding image placeholders
  const medalImages = {
    NoPin: NoPinMedal,
    Silver: silverMedal,
    Gold: goldMedal,
    Emerald: emeraldMedal,
    Diamond: diamondMedal,
    'Ambassador': ambassadorMedal
  };

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch(`${API_URL}/user_points/?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch ranking and points');
        }
        const data = await response.json();
        setPoints(data);
        console.log('members', data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [userId]);

  if (loading) {
    return (
      <Spinner size='sm'></Spinner>
    );
  }

  // Determine which medal is active, default to Bronze if status isn't in the medals array
  const activeMedal = medals.includes(points.status) ? points.status : 'NoPin';

  const getMedalOpacity = (medal) => {
    return activeMedal === medal ? 'opacity-100' : 'opacity-30'; // Active medal is full opacity, others are dimmed
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex gap-4 flex-col lg:flex-row'>
        <Card className="shadow rounded-lg p-4 mb-4">
          <Card.Body className="flex flex-col items-center">
            {/* Medal Display */}
            <div className="flex justify-center gap-4 mt-4">
              {['NoPin', ...medals].map((medal) => (
                <div
                  key={medal}
                  className={`flex flex-col items-center transition-all ${getMedalOpacity(medal)}`}
                >
                  <img
                    src={medalImages[medal]}
                    alt={`${medal} medal`}
                    className="w-12 h-12 object-cover"
                  />
                  <p className="font-bold text-xs mt-1">{medal}</p>
                </div>
              ))}
            </div>

            {/* Current Ranking Info */}
            {/* <h5 className="font-bold">Current Ranking</h5> */}
            {/* <p className="text-xl">{points.status}</p> */}
          </Card.Body>
        </Card>

        {/* Points Card */}
        <Card className="shadow rounded-lg p-4 mb-4">
          <Card.Body className="flex flex-col items-center">
            <div className="text-6xl mb-4">🏅</div>
            <h5 className="font-bold">Points</h5>
            <p className="text-xl">{points.points}</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Ranking;
