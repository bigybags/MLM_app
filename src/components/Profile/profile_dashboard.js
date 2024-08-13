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
import "../../styles/dashboard.css"
import ProfileComponent from "./profile_component";
import ProfileForm from "./profile_form";

function ProfileDashboard() {

    return (
                <Container fluid>
                    <div className="space-y-6">
                        <ProfileComponent ></ProfileComponent>
                    </div>
                    {/* <div className="bg-white">
                        <ProfileForm></ProfileForm>
                    </div> */}
                </Container>
    );
}

export default ProfileDashboard;
