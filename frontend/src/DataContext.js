import React, { createContext, useState, useContext } from 'react';
import { fetchAgentsAndRoles } from './services/SelectionScreen';

// Create Context
const DataContext = createContext();

// Custom hook for consuming context
export const useData = () => useContext(DataContext);

// Provider Component
export const DataProvider = ({ children }) => {
  const [allAgents, setAgents] = useState([]); // For storing agents data
  const [lockedAgent, setLockedAgent] = useState(null); // For storing the selected (locked) agent

  // Function to fetch agents data (optional, can be done in components)
  const fetchAgentsData = async () => {
    try {
      const result = await fetchAgentsAndRoles();
      setAgents(result);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  return (
    <DataContext.Provider value={{ allAgents, setAgents, lockedAgent, setLockedAgent, fetchAgentsData }}>
      {children}
    </DataContext.Provider>
  );
};
