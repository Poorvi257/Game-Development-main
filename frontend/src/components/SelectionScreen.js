import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, Typography, Chip, Avatar, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil'; // Changed from useRecoilState to useRecoilValue
import { selectedAgentAtom, valorantDataState } from '../recoil/Homescreen_recoil';

// Assuming valorantDataState is an atom representing the original list of agents
const roles = ['Duelist', 'Initiator', 'Controller', 'Sentinel'];

function SelectionScreen() {
  const [selectedRole, setSelectedRole] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]); // Local state for filtered agents
  const agents = useRecoilValue(valorantDataState); // Only read from Recoil, no need to set
  const [lockedAgent, setLockedAgent] = useRecoilState(selectedAgentAtom)
  const navigate = useNavigate();

  // Effect to filter agents based on selected role
  useEffect(() => {
    const filterAgents = () => {
      if (selectedRole) {
        return agents.filter(agent => agent?.role?.displayName === selectedRole);
      }
      return agents; // Return all agents if no role is selected
    };

    setFilteredAgents(filterAgents()); // Update filtered agents based on selected role
  }, [selectedRole, agents]); // Depend on agents to update filteredAgents when the original list changes

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const clearFilters = () => {
    setSelectedRole(''); // Reset selected role to clear filters
  };

  const lockInAgent = (agent) => {
    setLockedAgent(agent)
    navigate('/game-started', { state: { agent } });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Select an Agent
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          {roles.map(role => (
            <Chip
              key={role}
              label={role}
              onClick={() => handleRoleSelect(role)}
              color={selectedRole === role ? 'primary' : 'default'}
              style={{ marginRight: '10px' }}
            />
          ))}
          <IconButton onClick={clearFilters}>
            <ClearIcon />
          </IconButton>
        </Grid>
        {filteredAgents.map(agent => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={agent.uuid}>
            <Card variant="outlined" style={{ opacity: agent.isPlayableCharacter ? 1 : 0.5 }}>
              <CardContent>
                <Typography variant="h5">{agent.displayName}</Typography>
                <Typography color="textSecondary">{agent.role?.displayName}</Typography>
                <Button
                  startIcon={<LockIcon />}
                  disabled={!agent.isPlayableCharacter}
                  onClick={() => lockInAgent(agent)}
                >
                  Lock In
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default SelectionScreen;
