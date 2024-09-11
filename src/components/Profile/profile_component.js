import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { Col, Row, Spinner, Button } from 'react-bootstrap';
import ShareCodeModal from './share_code_modal';
import UploadModal from './file_upload_modal';
import { API_URL } from"../../utils/config";


const ProfileComponent = () => {
  const [userid, setUserId] = useState(null);
  const [ProfileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for handling modal visibility
  const [showUploadModal, setShowUploadModal] = useState(false); // State for handling modal visibility



  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = Cookies.get('userId');
        setUserId(userId)
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_URL}/profile/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        console.log(data);
        setProfileData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <p><Spinner size='sm'></Spinner></p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!ProfileData) {
    return null;
  }

  const handleOpenModal = () => setShowModal(true);
  const handleUploadOpenModel = () => setShowUploadModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleUploadCloseModal = () => setShowUploadModal(false);

  return (
    <div className="flex justify-center items-center mt-[5%] bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex">
        <div className="w-[25%] flex flex-col items-center border-r border-gray-200 pr-6">
          <img
            src="https://user.infinitemlmsoftware.com/images/user-profile.png"
            alt="Profile"
            className="rounded-full w-24 h-24 mb-4"
          />
          <h2 className="text-center text-2xl font-semibold mb-2">{ProfileData.user.first_name} {ProfileData.user.last_name}</h2>
          <p className="text-center text-gray-500 mb-2">{ProfileData.user_points.status}</p>
          <div className="flex space-x-2 mt-2">
            <button className="p-1 bg-blue-500 text-white rounded-full"><i className="fas fa-edit"></i></button>
            <button className="p-1 bg-green-500 text-white rounded-full"><i className="fas fa-check"></i></button>
          </div>
        </div>
        <div className="w-[75%] pl-6">
          <Row className='mb-4'>
            <Col>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{ProfileData.user.email}</p>
              </div>
            </Col>
            <Col>
              <div>
                <p className="text-gray-600">Phone No.</p>
                <p className="font-semibold">{ProfileData.user.phone_no}</p>
              </div>
            </Col>
          </Row>
          <Row className='mb-4'>
            <Col>
              <div>
                <p className="text-gray-600">First Name</p>
                <p className="font-semibold">{ProfileData.user.first_name}</p>
              </div>
            </Col>
            <Col>
              <div>
                <p className="text-gray-600">Last Name</p>
                <p className="font-semibold">{ProfileData.user.last_name}</p>
              </div>
            </Col>
          </Row>
          <Row className='mb-4'>
            <Col>
              <div>
                <p className="text-gray-600">Position</p>
                <p className="font-semibold">{ProfileData.user_points.status}</p>
              </div>
            </Col>
            <Col>
              <div>
                <p className="text-gray-600">Referral Code</p>
                <p className="font-semibold">{ProfileData.user.user_referral_code}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="flex space-x-4 mb-4">
                <Button variant="success" onClick={handleOpenModal}>
                  Share Code
                </Button>
              </div>
            </Col>
            <Col>
              <div className="flex space-x-4 mb-4">
                <Button variant="primary" onClick={handleUploadOpenModel}>
                  Upload Documents
                </Button>
              </div>
            </Col>
          </Row>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-purple-500 font-semibold">Members</p>
              <p className="text-xl font-semibold">{ProfileData.referrals_count}</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-500 font-semibold">Points</p>
              <p className="text-xl font-semibold">{ProfileData.user_points.points}</p>
            </div>
            <div className="text-center">
              <p className="text-green-500 font-semibold">Referral Points</p>
              <p className="text-xl font-semibold">{ProfileData.user_points.referral_points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Code Modal */}
      <ShareCodeModal
        show={showModal}
        handleClose={handleCloseModal}
        userReferralCode={ProfileData.user.user_referral_code}
      />
       <UploadModal
        show={showUploadModal}
        handleClose={handleUploadCloseModal}
        userId={userid}
      />
    </div>
  );
};

export default ProfileComponent;
