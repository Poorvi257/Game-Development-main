import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';

const GameStartedScreen = () => {
  const { lockedAgent, setLockedAgent } = useData();
  let navigate = useNavigate();

  useEffect(() => {
    const storedLockedAgent = localStorage.getItem('lockedAgent');
    if (storedLockedAgent) {
      setLockedAgent(JSON.parse(storedLockedAgent));
    }
  }, []);

  const handleReturnHome = () => {
    navigate('/home'); 
  };

  return (
    <div>
      <h2>Game Started</h2>
      <div>
        <p>Selected Agent: {lockedAgent?.displayName}</p>
        <img src={lockedAgent?.image_url} alt={lockedAgent?.displayName} style={{ width: 100, height: 100 }} />
      </div>
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  );
};

export default GameStartedScreen;
