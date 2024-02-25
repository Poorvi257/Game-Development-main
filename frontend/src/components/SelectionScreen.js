import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, Typography, Chip, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil'; // No longer need useRecoilValue since we're fetching data
import { selectedAgentAtom } from '../recoil/Homescreen_recoil';

function SelectionScreen() {
  const [selectedRole, setSelectedRole] = useState('');
  const [allAgents, setAllAgents] = useState([]); // State to hold the original list of agents
  const [filteredAgents, setFilteredAgents] = useState([]); // State for agents filtered by role
  const [roles, setRoles] = useState([]);
  const [lockedAgent, setLockedAgent] = useRecoilState(selectedAgentAtom);
  const navigate = useNavigate();

  // Fetch agents and their roles on mount
  useEffect(() => {
    const fetchAgentsAndRoles = async () => {
      const response = await fetch('http://localhost:8000/api/v1/agents/');
      const data = await response.json();
      setAllAgents(data); // Store the original list of agents
      setFilteredAgents(data); // Initially, no filter is applied so this is the full list
      // Extract and set unique roles from fetched data
      const uniqueRoles = [...new Set(data.map(agent => agent.role_name))];
      setRoles(uniqueRoles);
    };

    fetchAgentsAndRoles();
  }, []);

  // Effect to filter agents based on selected role
  useEffect(() => {
    if (selectedRole) {
      // Apply filter to allAgents to get the filtered list
      setFilteredAgents(allAgents.filter(agent => agent.role_name === selectedRole));
    } else {
      // If no role is selected, show all agents
      setFilteredAgents(allAgents);
    }
  }, [selectedRole, allAgents]); // Depend on allAgents and selectedRole

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const clearFilters = () => {
    setSelectedRole(''); // Reset selected role to clear filters
  };

  const lockInAgent = (agent) => {
    setLockedAgent(agent);
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
          <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
            <Card variant="outlined" style={{ opacity: 1 }}> {/* Assuming all agents are playable for simplicity */}
              <CardContent>
                <Typography variant="h5">{agent.displayName}</Typography>
                <Typography color="textSecondary">{agent.role_name}</Typography>
                <Button
                  startIcon={<LockIcon />}
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
