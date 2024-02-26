import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../styles/Common.css"

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header style={{ background: "transparent", display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
      <Button
       className='button'
       onClick={handleLogout} color="inherit">
        Logout
      </Button>
    </header>
  );
};

export default Header;
