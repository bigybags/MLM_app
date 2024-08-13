import React, {useState, useEffect} from "react";
// import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Sidebar from "./sidebar";
import TopNavbar from "./navbar";
import "../styles/dashboard.css";
import InfoCard from "./info-card";
import Graph from "./Graph";
import NewMembers from "./new_members";
import Ranking from "./ranking";
import EarningsAndExpenses from "./EarningandExpenses";
import Cookies from 'js-cookie';


function Dashboard() {
  const userId = Cookies.get('userId'); // Retrieve userId from cookies

  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Joinings',
        data: [],
        borderColor: 'rgba(128, 0, 128, 1)',
        backgroundColor: 'rgba(128, 0, 128, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  });

  const [newMembers, setNewMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/referralstats/?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data  )
          // Extract labels and data for the chart
          const labels = Object.keys(data);
          const chartData = Object.values(data);

          // Update the graph data state
          setGraphData({
            labels: labels,
            datasets: [
              {
                label: 'Joinings',
                data: chartData,
                borderColor: 'rgba(128, 0, 128, 1)',
                backgroundColor: 'rgba(128, 0, 128, 0.1)',
                fill: true,
                tension: 0.4
              }
            ]
          });
        } 
        else {
          console.error('Failed to fetch referral stats');
        }
      } 
      catch (error) {
        console.error('Error fetching referral stats:', error);
      }
    };

    fetchReferralStats();
  }, [userId]);

  useEffect(() => {
    const fetchNewMembers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/new_members/?user_id=${userId}`); // Replace '1' with the actual user ID
        if (!response.ok) {
          throw new Error('Failed to fetch new members');
        }
        const data = await response.json();
        setNewMembers(data.referees);
        console.log('memebers',data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewMembers();
  }, []);

  // const data = {
  //   labels: ['Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23', 'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24'],
  //   datasets: [
  //     {
  //       label: 'Joinings',
  //       data: [0, 1, 2, 8, 6, 4, 8, 5, 0, 14, 4, 0],
  //       borderColor: 'rgba(128, 0, 128, 1)',
  //       backgroundColor: 'rgba(128, 0, 128, 0.1)',
  //       fill: true,
  //       tension: 0.4
  //     }
  //   ]
  // };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // const newMembers = [
  //   { name: 'John Doe', username: 'johndoe', date: 'Aug 1, 2024' },
  //   { name: 'Jane Smith', username: 'janesmith', date: 'Aug 2, 2024' },
  //   { name: 'Sam Wilson', username: 'samwilson', date: 'Aug 3, 2024' }
  // ];

  return (
        <Container fluid className="mt-2">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <InfoCard title="E-wallet Balance" value="$ 3.83" color="text-purple-600" />
              <InfoCard title="Income" value="$ 100.50" color="text-green-600" />
              <InfoCard title="Bonus" value="$ 5" color="text-blue-600" />
              <InfoCard title="Paid" value="$ 0" color="text-blue-600" />
              <InfoCard title="Pending Amount" value="$ 0" color="text-blue-600" />
            </div>
            <div className="flex gap-6">
              <div className="w-[70%]">
                <Graph data={graphData} options={options} />
              </div>
              <div className="w-[30%]">
                <NewMembers members={newMembers} />
              </div>
            </div>
            <div className="mt-4 flex gap-6"> 
              <div>
                <Ranking userId={userId}></Ranking>
              </div>
              {/* <div>
                <EarningsAndExpenses></EarningsAndExpenses>
              </div> */}
            </div>
          </div>
        </Container>
  );
}

export default Dashboard;
