import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { HiOutlineUserCircle } from 'react-icons/hi';
import '../../styles/network.css'; // Assuming you have some CSS for styling
import { Spinner } from 'react-bootstrap';
// Import medal images
import bronzeMedal from '../../assets/medals/bronze.jpeg';
import NoPin from '../../assets/medals/nopin.jpeg';
import silverMedal from '../../assets/medals/silver.jpeg';
import goldMedal from '../../assets/medals/Gold.jpeg';
import emeraldMedal from '../../assets/medals/Emerald.jpeg';
import diamondMedal from '../../assets/medals/diamond.jpeg';
import ambassadorMedal from '../../assets/medals/bronze.jpeg';
import { API_URL } from "../../utils/config";


const medals = ['Silver', 'Gold', 'Emerald', 'Diamond', 'Ambassador'];

const medalImages = {
  NoPin: NoPin,
  Silver: silverMedal,
  Gold: goldMedal,
  Emerald: emeraldMedal,
  Diamond: diamondMedal,
  'Ambassador': ambassadorMedal,
};

const getStatusMedal = (status) => {
  const activeStatus = medals.includes(status) ? status : 'NoPin'; // Default to Bronze if status not found
  const medalImage = medalImages[activeStatus];
  return <img src={medalImage} alt={`${activeStatus} medal`} className="node-medal" style={{ width: '30px', height: '30px' }} />;
};

const Node = ({ name, username, points, status, isActive }) => {
  const nodeStyle = {
    opacity: isActive ? 1 : 0.5, // Dull color when inactive
    backgroundColor: isActive ? '#fff' : '#f0f0f0', // Slightly grey background when inactive
    borderColor: isActive ? '#ccc' : '#dcdcdc', // Light border when inactive
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '10px',
    borderRadius: '5px',
  };

  return (
    <div className="node-container" style={nodeStyle}>
      {getStatusMedal(status)}
      <span className="node-name">{name}</span>
      <span className="node-username">{username}</span>
      <span className="node-points">Points: {points}</span>
      <span className="node-status">Status: {status}</span>
    </div>
  );
};

const NetworkGraph = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [user_points, setPoints] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/user_network/?id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data); // For debugging
          setUser(data.user);
          setReferrals(data.referrals);
          setPoints(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const renderTree = (user, referrals) => {
    return (
      <Tree
        lineWidth={'2px'}
        lineColor={'#ccc'}
        lineBorderRadius={'10px'}
        label={<Node name={user.first_name + ' ' + user.last_name} points={user_points.user_points.points} status={user_points.user_points.status} isActive={true} />}
      >
        {referrals && referrals.length > 0 && referrals.map(referral => (
          <TreeNode
            key={referral.id}
            label={<Node name={referral.referee_name} points={referral.referee_points} status={referral.status} isActive={referral.isActive} />}
          >
            {referral.referrals && referral.referrals.length > 0 && renderTree(referral, referral.referrals)}
          </TreeNode>
        ))}
      </Tree>
    );
  };

  if (!user) return <div><Spinner size="sm"></Spinner></div>;

  return (
    <div className="chart-container">
      {renderTree(user, referrals)}
    </div>
  );
};

export default NetworkGraph;
