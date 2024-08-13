import React from "react";
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
import Sidebar from "../sidebar";
import TopNavbar from "../navbar";
import NetworkGraph from "./nodegraph";
import "../../styles/dashboard.css"
import Cookies from 'js-cookie';


function NetworkDashboard() {
    const userId = Cookies.get('userId'); // Retrieve userId from cookies

    return (    
        <Container fluid className="mt-2">
            <div className="p-6 space-y-6">
                <NetworkGraph userId={userId} />
            </div>
        </Container>

    );
}

export default NetworkDashboard;
