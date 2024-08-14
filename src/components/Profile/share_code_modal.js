import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCopy, FaCheck } from 'react-icons/fa';
import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';

const ShareCodeModal = ({ show, handleClose, userReferralCode }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const referralLink = `https://mlm-app-opal.vercel.app/?ref=${userReferralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareMessage = `Join now using my referral link!`;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share Your Referral Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="border rounded p-2 flex-grow"
            />
            <Button
              variant="outline-secondary"
              onClick={handleCopy}
              className="ml-2"
            >
              {copySuccess ? <FaCheck /> : <FaCopy />}
            </Button>
          </div>
          <div className="flex space-x-4 mt-4">
            <WhatsappShareButton
              url={referralLink}
              title={shareMessage}
              className="whatsapp-share-button"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <FacebookMessengerShareButton
              url={referralLink}
              title={shareMessage}
              className="messenger-share-button"
            >
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
            <TelegramShareButton
              url={referralLink}
              title={shareMessage}
              className="telegram-share-button"
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <EmailShareButton
              url={referralLink}
              subject="Join now using my referral link!"
              body={shareMessage}
              className="email-share-button"
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareCodeModal;