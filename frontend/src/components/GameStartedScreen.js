import React from 'react';
import { useRecoilValue } from 'recoil';
import { selectedAgentAtom, valorantDataState } from '../recoil/Homescreen_recoil'; // Assuming you have this atom
import { useNavigate } from 'react-router-dom'; // If you're using react-router for navigation

const GameStartedScreen = () => {
  const lockedAgent = useRecoilValue(selectedAgentAtom)

  let navigate = useNavigate();

  const handleReturnHome = () => {
   navigate('/'); // Adjust according to your routing setup
  };

  return (
    <div>
      <h2>Game Started</h2>
      <div>
        <p>Selected Agent: {lockedAgent.displayName}</p>
        <img src={lockedAgent?.displayIcon} alt={lockedAgent?.displayName} style={{ width: 100, height: 100 }} />
        {/* Display more details about the selected agent as needed */}
      </div>
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  );
};

export default GameStartedScreen;
