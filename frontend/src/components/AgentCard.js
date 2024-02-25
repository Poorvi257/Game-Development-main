import React from 'react';

function AgentCard({ agent, onSelect }) {
  return (
    <div onClick={() => onSelect(agent)}>
      <img src={agent.image} alt={agent.name} />
      <h3>{agent.name}</h3>
    </div>
  );
}

export default AgentCard;
