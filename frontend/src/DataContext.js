import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchAgentsAndRoles } from './services/SelectionScreen';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [allAgents, setAgents] = useState([]);
  const [lockedAgent, setLockedAgent] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const result = await fetchAgentsAndRoles();
        setAgents(result);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };

    initializeData();
  }, []);

  return (
    <DataContext.Provider value={{ allAgents, setAgents, lockedAgent, setLockedAgent }}>
      {children}
    </DataContext.Provider>
  );
};
