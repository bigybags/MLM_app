import React from "react";
import { Col, Row } from "react-bootstrap";
import banner_image1 from "../assets/product/banner_1.png";
import banner_image2 from "../assets/product/banner_2.png";
import banner_image3 from "../assets/product/banner_3.png";

function Banner() {
    return (
        <Row className='mb-2 bg-[#F6F6F6] p-[1%]'>
            <Col className='rounded-sm'>
                <img src={banner_image1} alt="Banner 1" />
            </Col>
            <Col className='rounded-sm'>
                <img src={banner_image2} alt="Banner 2" />
            </Col>
            <Col className='rounded-sm'>
                <img src={banner_image3} alt="Banner 3" />
            </Col>
        </Row>
    )
};

export default Banner;