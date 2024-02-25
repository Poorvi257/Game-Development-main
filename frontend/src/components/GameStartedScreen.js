import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedAgentAtom } from '../recoil/Homescreen_recoil';
import { useNavigate } from 'react-router-dom';
// import jwtDecode to decode the token
import jwtDecode from 'jwt-decode';

const GameStartedScreen = () => {
  const lockedAgent = useRecoilValue(selectedAgentAtom);
  let navigate = useNavigate();

  // Function to lock the agent by sending data to the backend
  const lockAgent = async () => {
    const token = localStorage.getItem('token'); // Example of retrieving the token

    // Get the userID from the jwt bearer token using jwt-decode
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await fetch('http://localhost:8000/api/v1/agents/lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure your auth strategy is accounted for
        },
        body: JSON.stringify({
          userId, // This needs to be determined based on your auth system
          agentId: lockedAgent.id, // Assuming the `id` property exists
        }),
      });

      const data = await response.json();
      console.log('Agent Locked:', data);
      // Handle response data or navigate
    } catch (error) {
      console.error('Error locking agent:', error);
      // Handle error (e.g., show an error message)
    }
  };

  // Call lockAgent when the component mounts if an agent is selected
  useEffect(() => {
    if (lockedAgent) {
      lockAgent();
    }
  }, [lockedAgent]);

  const handleReturnHome = () => {
    navigate('/home'); // Adjust according to your routing setup
  };

  return (
    <div>
      <h2>Game Started</h2>
      <div>
        <p>Selected Agent: {lockedAgent.displayName}</p>
        <img src={lockedAgent?.displayIcon} alt={lockedAgent?.displayName} style={{ width: 100, height: 100 }} />
      </div>
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  );
};

export default GameStartedScreen;
