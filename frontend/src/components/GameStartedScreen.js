import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../DataContext';
import { Typography, Button, Avatar, Container } from '@mui/material';

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
    <Container>
      <Typography variant="h4" gutterBottom>Game Started</Typography>
      <div>
        <Typography variant="subtitle1">Selected Agent: {selectedAgent?.displayName}</Typography>
        <Avatar
          src={selectedAgent?.image_url}
          alt={selectedAgent?.displayName}
          style={{ width: 100, height: 100, margin: 'auto' }}
        />
      </div>
      <Button variant="contained" color="primary" onClick={handleReturnHome} style={{ marginTop: '20px' }}>
        Return to Home
      </Button>
    </Container>
  );
};

export default GameStartedScreen;
