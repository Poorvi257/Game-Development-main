import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { login, signUp } from '../services/LoginPage';

const CustomButton = styled(Button)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: '10px',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
});

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: 'black',
    backgroundColor: 'white',
    border: '2px solid',
    borderColor: 'white',
    borderRadius: '4px',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  marginBottom: '20px',
});

const AgentImage = styled('img')({
  position: 'absolute',
  height: '70%',
  '&:first-of-type': {
    transform: 'rotate(-5deg)',
    left: 0,
    bottom: "20vh",
  },
  '&:nth-of-type(2)': {
    transform: 'rotate(5deg)',
    right: 0,
    bottom: "20vh",
  },
});

export default function LoginPage() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = async () => {
    let res = await login(username, password)
    if(res) navigate("/home");
  };

  const handleSignUpClick = async () => {
    let res = await signUp(username, password)
    if(res) navigate("/home")
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
      <AgentImage src="https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png" alt="Sova" />
      <AgentImage src="https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/fullportrait.png" alt="Other Agent" />
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
      <CustomButton onClick={handleSignUpClick}>Sign Up</CustomButton>
      <CustomButton onClick={handleLoginClick}>Login</CustomButton>
    </Box>
  );
}
