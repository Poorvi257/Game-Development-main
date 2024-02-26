import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../DataContext';
import { Typography, Button, Avatar } from '@mui/material';
import '../styles/GameStartedScreen.css'; // Make sure this path is correct

const GameStartedScreen = () => {
  const { setLockedAgent } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAgent } = location.state || {};

  useEffect(() => {
    if (selectedAgent) {
      setLockedAgent(selectedAgent);
    }
  }, [selectedAgent, setLockedAgent]);

  const handleReturnHome = () => {
    navigate('/home');
  };

  return (
    <div className="gameStartedContainer">
      <Typography variant="h4" className="gameStartedTitle" gutterBottom>
        Game Started
      </Typography>
      <Typography variant="h4" className="agentName">
        {selectedAgent?.displayName}
      </Typography>
      <img
        src={selectedAgent?.full_image}
        className="agentImage"
        alt={selectedAgent?.displayName}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleReturnHome}
        className="returnHomeButton"
      >
        Return to Home
      </Button>
    </div>
  );
};

export default GameStartedScreen;
