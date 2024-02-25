import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../DataContext';

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
    <div>
      <h2>Game Started</h2>
      <div>
        <p>Selected Agent: {selectedAgent?.displayName}</p>
        <img src={selectedAgent?.image_url} alt={selectedAgent?.displayName} style={{ width: 100, height: 100 }} />
      </div>
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  );
};

export default GameStartedScreen;
