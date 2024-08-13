import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { HiOutlineUserCircle } from 'react-icons/hi';
import '../../styles/network.css'; // Assuming you have some CSS for styling
import { Spinner } from 'react-bootstrap';

const Node = ({ name, username, points }) => (
  <div className="node-container">
    <HiOutlineUserCircle className="node-icon" />
    <span className="node-name">{name}</span>
    <span className="node-username">{username}</span>
    <span className="node-points">Points: {points}</span>
  </div>
);

const NetworkGraph = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [user_points, setPoints] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user_network/?id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data); // For debugging
          setUser(data.user);
          setReferrals(data.referrals);
          setPoints(data)
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
    console.log(user)
    console.log(referrals)
    return (
      <Tree
        lineWidth={'2px'}
        lineColor={'#ccc'}
        lineBorderRadius={'10px'}
        label={<Node name={user.first_name + ' ' + user.last_name}  points={user_points.user_points.points}/>}
      >
        {referrals && referrals.length > 0 && referrals.map(referral => (
          <TreeNode key={referral.id} label={<Node name={referral.referee_name} points={referral.referee_points} />}>
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
