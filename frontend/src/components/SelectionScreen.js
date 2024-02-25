import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Chip, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { insertLockedAgent } from '../services/GameStartedScreen';
import AgentCard from './AgentCard';
import { useData } from '../DataContext';

function SelectionScreen() {
  const navigate = useNavigate()

  const { allAgents, lockedAgent, setLockedAgent } = useData();
  const [filteredAgents, setFilteredAgents] = useState(allAgents)
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const uniqueRoles = [...new Set(allAgents.map(agent => agent.role_name))];
    setRoles(uniqueRoles);
  }, [allAgents])
  
  useEffect(() => {
    // Persist lockedAgent to localStorage
    if (lockedAgent) {
      localStorage.setItem('lockedAgent', JSON.stringify(lockedAgent));
    }
  }, [lockedAgent]);

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

  const sendLockAgent = async (agent) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');
  
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      if (!userId) throw new Error('User ID not found in token');
  
      if (!agent?.id) throw new Error('Locked agent ID is missing');
  
      const res = await insertLockedAgent(userId, agent?.id, token);
      return res; 
    } catch (error) {
      console.error('Error in sendLockAgent:', error);
      return null; 
    }
  };
  
  const lockInAgent = async (agent) => {
    setLockedAgent(agent); 
  
    try {
      const res = await sendLockAgent(agent); 
      if (res) {
        navigate('/game-started');
      }
      else{
        alert("Error locking in agent!")
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
            <Card variant="outlined" style={{ opacity: 1 }}>
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