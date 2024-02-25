import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Chip, IconButton, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Ensure correct import
import { insertLockedAgent } from '../services/GameStartedScreen';
import AgentCard from './AgentCard';
import { useData } from '../DataContext';

function SelectionScreen() {
  const navigate = useNavigate();

  const { allAgents, setLockedAgent } = useData();
  const [filteredAgents, setFilteredAgents] = useState(allAgents);
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null); // Track selected agent ID

  useEffect(() => {
    const uniqueRoles = [...new Set(allAgents.map(agent => agent.role_name))];
    setRoles(uniqueRoles);
  }, [allAgents]);

  useEffect(() => {
    if (selectedRole) {
      setFilteredAgents(allAgents.filter(agent => agent.role_name === selectedRole));
    } else {
      setFilteredAgents(allAgents);
    }
  }, [selectedRole, allAgents]);

  const handleAgentSelect = (agent) => {
    setSelectedAgentId(prevSelectedId => prevSelectedId === agent.id ? null : agent.id);
  };

  const lockInSelectedAgent = async () => {
    const selectedAgent = allAgents.find(agent => agent.id === selectedAgentId);
    setLockedAgent(selectedAgent);
    // Proceed with the existing lockInAgent logic
    // This assumes that the existing lockInAgent and sendLockAgent functions can handle locking in the selected agent correctly.
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Select an Agent</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
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
        </Grid>
        {filteredAgents.map(agent => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
            <Card variant="outlined">
              <CardContent>
                <AgentCard
                  agent={agent}
                  onSelect={() => handleAgentSelect(agent)}
                  selected={selectedAgentId === agent.id}
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
        disabled={!selectedAgentId}
        onClick={lockInSelectedAgent}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        Lock In
      </Button>
    </div>
  );
}

export default SelectionScreen;
