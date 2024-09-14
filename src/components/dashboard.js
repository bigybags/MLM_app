import React, { useState, useEffect } from "react";
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
  Spinner
} from "react-bootstrap";
import Sidebar from "./sidebar";
import TopNavbar from "./navbar";
import "../styles/dashboard.css";
import InfoCard from "./info-card";
import Graph from "./Graph";
import NewMembers from "./new_members";
import Ranking from "./ranking";
import Cookies from 'js-cookie';
import { API_URL } from "../utils/config";
import PurchasesLineGraph from "./Graphs/user_referral_graph";


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
  const [currentStatement, setCurrentStatement] = useState(null);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingStatement, setLoadingStatement] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const response = await fetch(`${API_URL}/referralstats/?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
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
        } else {
          console.error('Failed to fetch referral stats');
        }
      } catch (error) {
        console.error('Error fetching referral stats:', error);
        setError(error.message);
      } finally {
        setLoadingGraph(false);
      }
    };

    fetchReferralStats();
  }, [userId]);

  useEffect(() => {
    const fetchNewMembers = async () => {
      try {
        const response = await fetch(`${API_URL}/new_members/?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setNewMembers(data.referees);
        } else {
          throw new Error('Failed to fetch new members');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchNewMembers();
  }, [userId]);

  useEffect(() => {
    const fetchCurrentStatement = async () => {
      try {
        const response = await fetch(`${API_URL}/get_current_statement/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentStatement(data);
        } else {
          throw new Error('Failed to fetch current statement');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingStatement(false);
      }
    };

    fetchCurrentStatement();
  }, [userId]);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Container fluid className="mt-2">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {loadingStatement ? (
            <Spinner animation="border" />
          ) : (
            <>
              <InfoCard title="Current Balance" value="£ 0" color="text-purple-600" />
              <InfoCard title="Income" value="£ 0" color="text-green-600" />
              <InfoCard title="Current Comission" value={`${currentStatement.commission_percentage ?? 0}%`} color="text-blue-600" />
              <InfoCard title="Total Paid" value="£ 0" color="text-blue-600" />
              <InfoCard title="Pending Amount" value="£ 0" color="text-blue-600" />
              <InfoCard
                title="User Purchase"
                value={`£${currentStatement.user_purchase ?? 0}`}  // Set to 0 if null or undefined
                color="text-purple-600"
              />
              <InfoCard
                title="Referral Purchase"
                value={`£${currentStatement.referral_purchase ?? 0}`}  // Set to 0 if null or undefined
                color="text-blue-600"
              />
              <InfoCard
                title="Cumulative Points"
                value={currentStatement.cumulative_points ?? 0}  // Set to 0 if null or undefined
                color="text-orange-600"
              />
              <div>
                {loadingMembers ? (
                  <Spinner animation="border" />
                ) : (
                  <Ranking userId={userId} />
                )}
              </div>
            </>
          )}

        </div>
        <div>
          <PurchasesLineGraph />
        </div>
        <div className="flex gap-6">
          <div className="w-[70%]">
            {loadingGraph ? (
              <Spinner animation="border" />
            ) : (
              <Graph data={graphData} options={options} />
            )}
          </div>
          <div className="w-[30%]">
            {loadingMembers ? (
              <Spinner animation="border" />
            ) : (
              <NewMembers members={newMembers} />
            )}
          </div>
        </div>

      </div>
    </Container>
  );
}

export default Dashboard;
