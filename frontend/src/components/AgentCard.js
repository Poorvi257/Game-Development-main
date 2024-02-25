import { Button, Typography } from '@mui/material';
import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function AgentCard({ agent, selected, onSelect, isEnabled = true }) {
  // Styling for the card when it's disabled
  const disabledStyle = {
    opacity: 0.5,
    backgroundColor: '#f0f0f0', // Gray out the background
    pointerEvents: 'none', // Disable pointer events
  };

  // Merge styles based on the enabled/disabled state
  const cardStyle = {
    cursor: 'pointer',
    border: selected ? '2px solid green' : 'none',
    ...(isEnabled ? {} : disabledStyle), // Apply disabled style if not enabled
  };

  // Adjusting image opacity based on the enabled/disabled state
  const imageStyle = {
    width: '70%',
    height: 'auto',
    opacity: isEnabled ? 1 : 0.5, // Reduce opacity if disabled
  };

  return (
    <div
      style={cardStyle}
      onClick={() => {
        if (isEnabled) {
          onSelect();
        }
      }}
    >
      <img src={agent.image_url} alt={agent.displayName} style={imageStyle} />
      <Typography variant="h5">{agent.displayName}</Typography>
      <Typography color="textSecondary">{agent.role_name}</Typography>
      {selected ? <CheckCircleOutlineIcon color="success" /> : <RadioButtonUncheckedIcon />}
    </div>
  );
}

export default AgentCard;
