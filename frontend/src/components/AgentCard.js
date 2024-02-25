import { Button, Typography } from '@mui/material';
import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // For selected state
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; // For deselected state

function AgentCard({ agent, selected, onSelect }) {
  return (
    <div style={{ cursor: 'pointer', border: selected ? '2px solid green' : 'none' }} onClick={onSelect}>
      <img src={agent.image_url} alt={agent.displayName} style={{ width: '70%', height: 'auto' }} />
      <Typography variant="h5">{agent.displayName}</Typography>
      <Typography color="textSecondary">{agent.role_name}</Typography>
      {selected ? <CheckCircleOutlineIcon color="success" /> : <RadioButtonUncheckedIcon />}
    </div>
  );
}

export default AgentCard;
