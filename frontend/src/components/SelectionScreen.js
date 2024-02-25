import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, Typography, Chip, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil'; // No longer need useRecoilValue since we're fetching data
import { selectedAgentAtom, valorantDataState } from '../recoil/Homescreen_recoil';
import { jwtDecode } from 'jwt-decode';
import { insertLockedAgent } from '../services/GameStartedScreen';
import AgentCard from './AgentCard';

function SelectionScreen() {
  const [selectedRole, setSelectedRole] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]); // Local state for filtered agents
  const allAgents = useRecoilValue(valorantDataState);
  const [roles, setRoles] = useState([]);
  const [lockedAgent, setLockedAgent] = useRecoilState(selectedAgentAtom);
  const navigate = useNavigate()

  useEffect(() => {
    const uniqueRoles = [...new Set(allAgents.map(agent => agent.role_name))];
    setRoles(uniqueRoles);
  }, [])

  useEffect(() => {
    if (selectedRole) {
      setFilteredAgents(allAgents.filter(agent => agent.role_name === selectedRole));
    } else {
      setFilteredAgents(allAgents);
    }  
  }, [selectedRole, allAgents]); 

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const clearFilters = () => {
    setSelectedRole(''); 
  };

  const sendLockAgent = async () => {
    const token = localStorage.getItem('token');

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    await insertLockedAgent(userId, lockedAgent.id, token)
  };

  const lockInAgent = (agent) => {
    setLockedAgent(agent);
    sendLockAgent()
    navigate('/game-started');
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
              <AgentCard agent={agent} onSelect={()=>lockInAgent(agent)}/>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default SelectionScreen;
