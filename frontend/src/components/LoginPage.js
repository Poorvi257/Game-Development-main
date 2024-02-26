import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login, signUp } from '../services/LoginPage';
import { CustomButton, CustomTextField, AgentImage } from './StyledComponents';

export default function LoginPage() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const agent1 = 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png'
  const agent2 = 'https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/fullportrait.png'

  const handleActionClick = async (action) => {
    try {
      const res = await action(username, password);
      if (res) navigate("/home");
      else throw new Error('Action failed'); 
    } catch (error) {
      console.error(error);
      setError('Failed to perform action. Please try again.'); 
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
      <AgentImage src={agent1} alt="Sova" />
      <AgentImage src={agent2} alt="Other Agent" />
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
