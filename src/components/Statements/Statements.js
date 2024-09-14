import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Table, Container, Row, Col, Spinner, Alert, Form, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';
import moment from 'moment';
import InfoCard from '../info-card';
import { API_URL } from "../../utils/config";


const Statements = () => {
    const [currentMonthStatement, setCurrentMonthStatement] = useState(null);
    const [statements, setStatements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredStatements, setFilteredStatements] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
    const [uniqueMonths, setUniqueMonths] = useState([]);
    const [referral_count, serReferralcount] = useState(0);

    useEffect(() => {
        const fetchStatements = async () => {
            try {
                const userId = Cookies.get('userId');
                const response = await fetch(`${API_URL}/get_user_statements/${userId}/`);

                if (!response.ok) {
                    throw new Error('Failed to fetch Statements');
                }

                const data = await response.json();
                console.log("Statements: ", data);
                setCurrentMonthStatement(data.current_month_statement);
                setStatements(data.statements);
                setFilteredStatements(data.statements);
                serReferralcount(data.referral_counts)
                // Extract unique months
                const months = [...new Set(data.statements.map(statement =>
                    moment(statement.created_at).format('YYYY-MM')
                ))];
                setUniqueMonths(months);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatements();
    }, []);

    const handleMonthFilter = (event) => {
        const selected = event.target.value;
        setSelectedMonth(selected);

        if (selected) {
            const filtered = statements.filter(statement =>
                moment(statement.created_at).format('YYYY-MM') === selected
            );
            setFilteredStatements(filtered);
        } else {
            setFilteredStatements(statements);
        }
    };



    return (
        <Container fluid className="p-4">
            <Row className="mt-4">
                <Col>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    ) : error ? (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    ) : (
                        <Tabs defaultActiveKey="currentInfo" id="statement-tabs" className="mb-3">
                            <Tab eventKey="currentInfo" title="Current Info">
                                {currentMonthStatement && (
                                    <Card className="p-4 shadow-md rounded-lg border border-gray-300">
                                        <Card.Title className="text-lg font-bold mb-3">Current Month Statement</Card.Title>
                                        <Card.Body className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {/* Using InfoCard Component */}
                                            <InfoCard title="User Purchase" value={`£${currentMonthStatement.user_purchase ?? 0}`} color="text-purple-600" />
                                            <InfoCard title="Referral Purchase" value={`£${currentMonthStatement.referral_purchase ?? 0}`} color="text-blue-600" />
                                            {/* <InfoCard title="Group Purchase" value={`£${currentMonthStatement.group_purchase ?? 0}`} color="text-green-600" /> */}
                                            <InfoCard title="Cumulative Purchase" value={`£${currentMonthStatement.cumulative_purchase ?? 0}`} color="text-red-600" />
                                            <InfoCard title="Cumulative Points" value={currentMonthStatement.cumulative_points ?? 0} color="text-orange-600" />
                                            <InfoCard title="Commission Percentage" value={`${currentMonthStatement.commission_percentage ?? 0}%`} color="text-teal-600" />
                                            <InfoCard title="Earned" value={`£${(() => {
                                                try {
                                                    const cumulativePoints = parseFloat(currentMonthStatement.cumulative_points) || 0;
                                                    const commissionPercentage = parseFloat(currentMonthStatement.commission_percentage) || 0;
                                                    const amount = (cumulativePoints * commissionPercentage) / 100;
                                                    return amount.toFixed(2);
                                                } catch (error) {
                                                    console.error('Error calculating earned amount:', error);
                                                    return '0.00';
                                                }
                                            })()}`} color="text-teal-600" />
                                            {currentMonthStatement.updated_at && (
                                                <InfoCard
                                                    title="Updated At"
                                                    value={new Date(currentMonthStatement.updated_at).toLocaleDateString()}
                                                    color="text-gray-600"
                                                />
                                            )}
                                            <InfoCard title="Referrals Joined" value={`${referral_count ?? 0}`} color="text-teal-600" />
                                        </Card.Body>
                                    </Card>
                                )}
                            </Tab>

                            <Tab eventKey="statements" title="Statements">
                                <Form.Group controlId="monthFilter" className="mb-3">
                                    <Form.Label>Select Month</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedMonth}
                                        onChange={handleMonthFilter}
                                        className="w-25"
                                    >
                                        {uniqueMonths.map((month, index) => (
                                            <option key={index} value={month}>
                                                {moment(month, 'YYYY-MM').format('MMMM YYYY')}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                {filteredStatements.length > 0 ? (
                                    <Table striped bordered hover responsive className="table-auto">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>User Purchase</th>
                                                <th>Referral Purchase</th>
                                                <th>Cummulative Purchase</th>
                                                <th>Cummulative Points</th>
                                                <th>Commission Percentage</th>
                                                <th>Commission Earned</th>
                                                <th>Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStatements.map((statement) => (
                                                <tr key={statement.id}>
                                                    <td>{statement.id}</td>
                                                    <td>£{statement.user_total_purchase}</td>
                                                    <td>£{statement.referral_total_purchase}</td>
                                                    <td>£{statement.cumulative_purchase}</td>
                                                    <td>{statement.cumulative_points}</td>
                                                    <td>{statement.commission_percentage}%</td>
                                                    <td>£{statement.commission_earned}</td>
                                                    <td>{new Date(statement.earned_at).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p>No statements available for the selected month.</p>
                                )}
                            </Tab>
                        </Tabs>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Statements;
