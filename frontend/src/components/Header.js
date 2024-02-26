import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header style={{ background: "transparent", display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
      <Button
      style={{    background: 'linear-gradient(135deg, rgb(255, 51, 66) 0%, rgb(255, 48, 64) 0.01%, rgb(255, 125, 102) 100%)',
      color: 'black',
      fontFamily: "Arial,sans-serif",
      fontWeight: 600
  }}
       onClick={handleLogout} color="inherit">
        Logout
      </Button>
    </header>
  );
};

export default Header;
