import React from 'react';
import "../styles/AgentCard.css"

function AgentCard({ agent, selected, onSelect, isEnabled = true }) {

  const handleClick = () => {
    if (isEnabled && onSelect) {
      onSelect(agent);
    }
  };

  const abilityIcons = agent.abilities_icons.split(", ").map((iconUrl, index) => (
    <img key={index} src={iconUrl} alt={`Ability ${index + 1}`} className="abilityIcon" />
  ));

  return (
    <div
      className={`agentCard ${selected ? 'selected' : ''}`}
      style={{
        backgroundImage: `url(${agent.image_url})`,
        opacity: isEnabled ? 1 : 0.5,
        cursor: isEnabled ? 'pointer' : 'default',
      }}
      onClick={handleClick}
    >
      <div className="agentName" style={{ fontSize: selected ? '1.75em' : '1.5em' }}>
        {agent.displayName}
      </div>
      {selected && (
        <div className="agentAbilities">
          {abilityIcons}
        </div>
      )}
    </div>
  );
}

export default AgentCard;
