import { Button, Typography } from '@mui/material';
import React from 'react';
import LockIcon from '@mui/icons-material/Lock';

function AgentCard({ agent, onSelect }) {
  return (
    <div>
    {/* style={{ background: 'linear-gradient(to right, #66a8ffff, #3b37a7ff, #261e4fff, #101042ff)'}}> */}
      <img src={agent.image_url} alt={agent.displayName} style={{ width: '70%', height: 'auto' }} />
      <Typography variant="h5">{agent.displayName}</Typography>
      <Typography color="textSecondary">{agent.role_name}</Typography>
      <Button
        startIcon={<LockIcon />}
        onClick={onSelect}
        variant="contained"
        color="primary"
      >
        Lock In
      </Button>
    </div>
  );
}

export default AgentCard;
