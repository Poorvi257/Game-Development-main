// LoginPage.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login, signUp } from '../services/LoginPage';
import { CustomButton, CustomTextField, AgentImage } from './StyledComponents'; // Import styled components from a separate file

export default function LoginPage() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For displaying error messages

  const handleActionClick = async (action) => {
    try {
      const res = await action(username, password);
      if (res) navigate("/home");
      else throw new Error('Action failed'); // Assuming the action functions return a truthy value on success
    } catch (error) {
      console.error(error);
      setError('Failed to perform action. Please try again.'); // Display a meaningful error message
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'black',
        position: 'relative',
      }}
    >
      <AgentImage src={`https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png`} alt="Sova" />
      <AgentImage src={`https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/fullportrait.png`} alt="Other Agent" />
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error messages */}
      <CustomTextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <CustomTextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <CustomButton onClick={() => handleActionClick(signUp)}>Sign Up</CustomButton>
      <CustomButton onClick={() => handleActionClick(login)}>Login</CustomButton>
    </Box>
  );
}
