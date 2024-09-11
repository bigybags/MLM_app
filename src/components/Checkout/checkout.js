import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    Button, Form, Spinner, Toast, ToastContainer,
    Container, Row, Col, Table, Alert, Card,
    Collapse
} from 'react-bootstrap';
import { CartContext } from '../../context/cartcontext';
import Cookies from 'js-cookie';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { API_URL } from "../../utils/config";



const Checkout = () => {
    const { cartItems, clearCart, cartError } = useContext(CartContext);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');
    const [loading, setisLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [postalCode, setPostalCode] = useState('');
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [postalCodeError, setPostalCodeError] = useState('');
    const [postalCodeValid, setPostalCodeValid] = useState(null);
    const [last_order, setlastOrder] = useState(null);

    const [open, setOpen] = useState(false);
    const [tip, setTip] = useState(0);
    
    // Assuming cartItems have the structure { name, quantity, price, image }
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const bagFee = 1.00;
    const serviceFee = 2.00;
    const deliveryFee = 3.00;
  
    const calculateTotal = () => {
      return subtotal + bagFee + serviceFee + deliveryFee + tip;
    };
  
    const tipOptions = [0, 0.10, 0.15, 0.20, 0.25];

    const navigate = useNavigate();
    const userId = Cookies.get('userId');

    const addressRef = useRef('');
    const selectedCountryNameRef = useRef('');
    const selectedCountryCodeRef = useRef('');
    const selectedStateRef = useRef('');
    const cityRef = useRef('');
    const postalCodeRef = useRef('');

    const validateForm = () => {
        return (
            address.trim() !== '' &&
            selectedCountryName !== '' &&
            selectedState !== '' &&
            city.trim() !== '' &&
            postalCode.trim() !== '' &&
            postalCodeValid !== false
        );
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {
        const fetch_latest_order = async () => {
            try {
                const response = await fetch(`${API_URL}/get_latest_order/?user_id=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data);
                if (data) {
                    setAddress(data.address_line_1)
                    setSelectedCountryName(data.country)
                    setSelectedState(data.state)
                    setCity(data.city)
                    setPostalCode(data.postal_code)
                    addressRef.current = data.address_line_1
                    selectedCountryNameRef.current = data.country
                    selectedStateRef.current = data.state
                    cityRef.current = data.city
                    postalCodeRef.current = data.postal_code
                }
            } catch (error) {
                console.error('Error fetching the latest order:', error);
            }
        };

        fetch_latest_order();
    }, [userId]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                setCountries(response.data.map(country => ({
                    name: country.name.common,
                    code: country.cca2
                })));
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (selectedCountryName) {
            const fetchStates = async () => {
                try {
                    const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ country: selectedCountryName }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setStates(data.data.states || []);
                } catch (error) {
                    console.error('Error fetching states:', error);
                }
            };

            fetchStates();
        }
    }, [selectedCountryName]);

    useEffect(() => {
        if (selectedCountryName && selectedState) {
            const fetchCities = async () => {
                try {
                    const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ country: selectedCountryName, state: selectedState }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setCities(data.data || []);
                } catch (error) {
                    console.error('Error fetching cities:', error);
                }
            };

            fetchCities();
        }
    }, [selectedCountryName, selectedState]);

    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        const selectedCountryObj = countries.find(country => country.name === selectedCountry);

        if (selectedCountryObj) {
            setSelectedCountryName(selectedCountryObj.name);
            setSelectedCountryCode(selectedCountryObj.code);
            selectedCountryNameRef.current = selectedCountryObj.name;
            selectedCountryCodeRef.current = selectedCountryObj.code;
        }

        setSelectedState('');
    };

    const handleStateChange = (e) => {
        selectedStateRef.current = e.target.value;
        setSelectedState(e.target.value);
    };

    const handleAddressChange = (e) => {
        addressRef.current = e.target.value;
        setAddress(e.target.value);
        validateForm();
    };

    const handleCityChange = (e) => {
        cityRef.current = e.target.value;
        setCity(e.target.value);
        validateForm();
    };

    const handlePostalCodeChange = (e) => {
        const code = e.target.value;
        postalCodeRef.current = code;
        setPostalCode(code);
        validateForm();
    };

    const handlePlaceOrder = async (details) => {
        setisLoading(true);
        if (!userId) {
            setToastMessage('User not authenticated.');
            setToastVariant('danger');
            setShowToast(true);
            setisLoading(false);
            return;
        }

        try {
            const orderData = {
                user: userId,
                total_amount: totalAmount.toFixed(2),
                order_details: cartItems.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                address_line_1: addressRef.current,
                country: selectedCountryNameRef.current,
                state: selectedStateRef.current,
                city: cityRef.current,
                postal_code: postalCodeRef.current
            };

            console.log("order data", orderData);

            const response = await fetch(`${API_URL}/order/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...orderData,
                    transaction_id: details.id
                }),
            });

            if (response.ok) {
                setToastMessage('Payment completed successfully!');
                setToastVariant('success');
                setShowToast(true);
                clearCart();
                navigate('/dashboard/orders');
            } else {
                const errorData = await response.json();
                setToastMessage(`Failed to process order: ${errorData.detail || 'Please try again.'}`);
                setToastVariant('danger');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error processing order:', error);
            setToastMessage('An error occurred. Please try again.');
            setToastVariant('danger');
            setShowToast(true);
        } finally {
            setisLoading(false);
        }
    };

    if (cartError) {
        return (
            <Container fluid className="py-5">
                <Row>
                    <Col>
                        <Alert variant="danger">{cartError}</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (cartItems.length === 0) {
        return (
            <Container fluid className="py-5">
                <Row>
                    <Col>
                        <Alert variant="info">Your cart is empty. Please add items to your cart.</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid className="py-5">
            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Delivery Details</Card.Title>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your address"
                                                value={address}
                                                onChange={handleAddressChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={selectedCountryName}
                                                onChange={handleCountryChange}
                                            >
                                                <option>Select your country</option>
                                                {countries.map((country, index) => (
                                                    <option key={index} value={country.name}>{country.name}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={selectedState}
                                                onChange={handleStateChange}
                                                disabled={!selectedCountryName}
                                            >
                                                <option>Select your state</option>
                                                {states.map((state, index) => (
                                                    <option key={index} value={state.name}>{state.name}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your City"
                                                value={city}
                                                disabled={!selectedState}
                                                onChange={handleCityChange}
                                            />
                                            {/* <Form.Control
                                    as="select"
                                    value={city}
                                    onChange={handleCityChange}
                                    disabled={!selectedState}
                                >
                                    <option>Select your city</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </Form.Control> */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Postal Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Postal Code"
                                                value={postalCode}
                                                onChange={handlePostalCodeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Delivery Options</Card.Title>
                            <Form>
                                <Form.Check
                                    type="radio"
                                    id="standard"
                                    name="deliveryOption"
                                    label="Standard"
                                    defaultChecked
                                />
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <PayPalScriptProvider options={{ "client-id": "AcfZegwsJHjZkBYFKkSAsNWTRDS3xF_7jjEr-bjMTxROkAj6Nlg1HVXyzIWIFb7Iujtex-uSMM_yTA1H", "currency": "GBP" }}>
                                <div className="relative z-0">
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: totalAmount.toFixed(2),
                                                    currency_code: "GBP",
                                                },
                                            }],
                                        });
                                    }}
                                    onApprove={async (data, actions) => {
                                        const details = await actions.order.capture();
                                        handlePlaceOrder(details);
                                    }}
                                    onError={(err) => {
                                        console.error('PayPal Checkout Error:', err);
                                        setToastMessage('An error occurred with PayPal checkout.');
                                        setToastVariant('danger');
                                        setShowToast(true);
                                        setisLoading(false);
                                    }}
                                    disabled={!validateForm() || loading}  // Disable PayPal button if form is not valid
                                />
                                </div>
                            </PayPalScriptProvider>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
      {/* Basket Summary Section */}
      <Card className="mb-4">
        <Card.Header
          className="d-flex justify-content-between align-items-center"
          onClick={() => setOpen(!open)}
          aria-controls="basket-summary"
          aria-expanded={open}
          style={{ cursor: 'pointer' }}
        >
          <span>Basket Summary ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
          {open ? <BsChevronUp /> : <BsChevronDown />}
        </Card.Header>
        <Collapse in={open}>
          <div id="basket-summary">
            <Card.Body>
              <Table borderless>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td><img src={"https://bigybags.com/cdn/shop/products/WebImages11_360x.jpg?v=1650099297"} alt={item.name} style={{ width: '50px' }} /></td>
                      <td>{item.name}</td>
                      <td>{item.quantity} x £{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </div>
        </Collapse>
      </Card>

      {/* Promotion Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Promotion</Card.Title>
          <Form.Group className="mb-3">
            <Form.Label>Add Promo Code</Form.Label>
            <Form.Control type="text" placeholder="Enter promo code" />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Order Total Section */}
      <Card>
        <Card.Body>
          <Card.Title>Order Total</Card.Title>
          <Table borderless>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>£{subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Bag Fee</td>
                <td>£{bagFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Service Fee</td>
                <td>£{serviceFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Delivery Fee</td>
                <td>£{deliveryFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Add a tip</td>
                <td>
                  {tipOptions.map((tipOption, index) => (
                    <Button
                      key={index}
                      variant={tipOption === tip ? "secondary" : "outline-secondary"}
                      onClick={() => setTip(tipOption * subtotal)}
                      className="me-2 mr-2 text-xs mb-2"
                    >
                      {tipOption === 0 ? "Not now" : `${(tipOption * 100).toFixed(0)}%`}
                    </Button>
                  ))}
                </td>
              </tr>
            </tbody>
          </Table>

          <hr />
          <Table borderless>
            <tbody>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>${calculateTotal().toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>

            </Row>

            <ToastContainer position="bottom-center" className="mb-4">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    bg={toastVariant === 'danger' ? 'danger' : 'success'}
                    delay={3000}
                    autohide
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default Checkout;
