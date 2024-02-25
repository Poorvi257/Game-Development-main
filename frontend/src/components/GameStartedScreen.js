import React from 'react';
import { useRecoilValue } from 'recoil';
import { selectedAgentAtom } from '../recoil/Homescreen_recoil';
import { useNavigate } from 'react-router-dom';

const GameStartedScreen = () => {
  const lockedAgent = useRecoilValue(selectedAgentAtom);
  let navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/home'); 
  };

  return (
    <div>
      <h2>Game Started</h2>
      <div>
        <p>Selected Agent: {lockedAgent.displayName}</p>
        <img src={lockedAgent?.image_url} alt={lockedAgent?.displayName} style={{ width: 100, height: 100 }} />
      </div>
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  );
};

export default GameStartedScreen;
