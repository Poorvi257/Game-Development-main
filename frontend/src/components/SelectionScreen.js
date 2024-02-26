import React, { useState, useMemo, useCallback } from 'react';
import { Grid, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ClearIcon from '@mui/icons-material/Clear';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { insertLockedAgent } from '../services/GameStartedScreen';
import AgentCard from './AgentCard';
import { useData } from '../DataContext';
import "../styles/SelectionScreen.css"

function SelectionScreen() {
  const navigate = useNavigate();
  const { allAgents } = useData();
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const location = useLocation();
  const passedHistory = location.state?.history || [];
  const [agentHistory, setAgentHistory] = useState(passedHistory);

  const roles = useMemo(() => {
    const rolesDict = {};

    for (let agent of allAgents) {
      const roleName = agent.role_name;
      if (!(roleName in rolesDict)) {
        rolesDict[roleName] = agent.role_icon;
      }
    }

    return Object.entries(rolesDict).map(([name, displayIcon]) => ({ name, displayIcon }));
  }, [allAgents]);

  const filteredAgents = useMemo(() => selectedRole ? allAgents.filter(agent => agent.role_name === selectedRole) : allAgents, [selectedRole, allAgents]);

  // Agent selection constraints
  const isAgentSelectable = useCallback((agentId) => {
    if (agentHistory.length >= 10) return false; // Maximum of 10 games per user

    const selectionCounts = agentHistory.reduce((acc, curr) => {
      acc[curr.agent_id] = (acc[curr.agent_id] || 0) + 1;
      return acc;
    }, {});

    if (selectionCounts[agentId] >= 3) return false; // Limit agent selection to 3 times

    const lastAgentId = agentHistory.length ? agentHistory[agentHistory.length - 1].agent_id : null;
    if (agentId === lastAgentId) return false; // No consecutive game selection for the same agent

    if (agentHistory.length >= 4) {
      const lastFourAgents = agentHistory.slice(-4).map((h) => h.agent_id);
      const uniqueLastFourAgents = [...new Set(lastFourAgents)];
      if (uniqueLastFourAgents.length === 4 && !uniqueLastFourAgents.includes(agentId)) {
        return false; // For the 5th game and onwards, one of the last four unique agents must be selected
      }
    }

    return true;
  }, [agentHistory]);

  const handleAgentSelect = useCallback((agent) => {
    if (isAgentSelectable(agent.id)) {
      setSelectedAgentId(prevSelectedId => prevSelectedId === agent.id ? null : agent.id);
    }
  }, [isAgentSelectable]);

  const lockInSelectedAgent = useCallback(async () => {
    if (!isAgentSelectable(selectedAgentId)) {
      alert("This agent cannot be locked in due to selection constraints.");
      return;
    }

    const selectedAgent = allAgents.find(agent => agent.id === selectedAgentId);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      if (!userId) throw new Error('User ID not found in token');

      const res = await insertLockedAgent(userId, selectedAgent.id, token);
      if (res) {
        navigate('/game-started', { state: { selectedAgent } });
      } else {
        alert("Error locking in agent!");
      }
    } catch (error) {
      console.error('Error locking in agent:', error);
    }
  }, [selectedAgentId, isAgentSelectable, allAgents, navigate]);

  return (
    <Grid container className="container">
      <Grid item xs={2} className="leftColumn">
        <ul className="filterList" style={{ paddingLeft: "1.2vw", marginTop: "4vh" }}>
          {roles.map((role, index) => (
            <li key={index} className="filterItem">
              <button
                onClick={() => setSelectedRole(role.name)}
                className={`filterButton ${selectedRole === role.name ? 'selected' : ''}`}
              >
                <div>
                  <div className="filterIcon"><img src={role.displayIcon} width={46} height={46} /></div>
                </div>
                <div className="filterText">{role.name}</div>
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setSelectedRole("")}
            >
              <div><ClearIcon /></div>
            </button>
          </li>
        </ul>
      </Grid>
      <Grid item xs={10} className="rightColumn" style={{ height: '100vh' }}>
        <div className="agentCardContainer">
          <Grid container>
            {filteredAgents.map((agent, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={2.4} style={{ padding: 0 }}>
                <AgentCard agent={agent}
                  onSelect={() => handleAgentSelect(agent)}
                  selected={selectedAgentId === agent.id}
                  isEnabled={isAgentSelectable(agent.id)}
                  className="agentCard"
                />
              </Grid>
            ))}
          </Grid>
        </div>
        <button size='large'
          className='lockInButton'
          disabled={!selectedAgentId || !isAgentSelectable(selectedAgentId)}
          onClick={lockInSelectedAgent}>
          Lock In
        </button>
      </Grid>

    </Grid>
  );
};

export default SelectionScreen;
