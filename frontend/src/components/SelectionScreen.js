import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Chip, IconButton, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ClearIcon from '@mui/icons-material/Clear';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode }   from 'jwt-decode';
import { insertLockedAgent } from '../services/GameStartedScreen';
import AgentCard from './AgentCard';
import { useData } from '../DataContext';

function SelectionScreen() {
  const navigate = useNavigate();
  const { allAgents } = useData();
  const [filteredAgents, setFilteredAgents] = useState(allAgents);
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const location = useLocation();
  const passedHistory = location.state?.history || [];
  const [agentHistory, setAgentHistory] = useState(passedHistory);

  useEffect(() => {
    const uniqueRoles = [...new Set(allAgents?.map(agent => agent.role_name))];
    setRoles(uniqueRoles);
  }, [allAgents]);

  useEffect(() => {
    if (selectedRole) {
      setFilteredAgents(allAgents.filter(agent => agent.role_name === selectedRole));
    } else {
      setFilteredAgents(allAgents);
    }
  }, [selectedRole, allAgents]);

  // Agent selection constraints
  const isAgentSelectable = (agentId) => {
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
  };

  const handleAgentSelect = (agent) => {
    if (isAgentSelectable(agent.id)) {
      setSelectedAgentId(prevSelectedId => prevSelectedId === agent.id ? null : agent.id);
    }
  };

  const lockInSelectedAgent = async () => {
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
        navigate('/game-started');
      } else {
        alert("Error locking in agent!");
      }
    } catch (error) {
      console.error('Error locking in agent:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Select an Agent
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {roles.map(role => (
          <Chip
            key={role}
            label={role}
            onClick={() => setSelectedRole(role)}
            color={selectedRole === role ? 'primary' : 'default'}
            style={{ marginRight: '10px' }}
          />
        ))}
        <IconButton onClick={() => setSelectedRole('')}>
          <ClearIcon />
        </IconButton>
        {filteredAgents.map((agent, key) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
            <Card variant="outlined">
              <CardContent>
                <AgentCard
                  agent={agent}
                  onSelect={() => handleAgentSelect(agent)}
                  selected={selectedAgentId === agent.id}
                  isEnabled={isAgentSelectable(agent.id)}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        startIcon={<LockIcon />}
        disabled={!selectedAgentId || !isAgentSelectable(selectedAgentId)}
        onClick={lockInSelectedAgent}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        Lock In
      </Button>
    </div>
  );
}

export default SelectionScreen;
