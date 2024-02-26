import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomeScreen from "./components/HomeScreen";
import SelectionScreen from "./components/SelectionScreen";
import GameStartedScreen from "./components/GameStartedScreen";
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import { DataProvider } from './DataContext';

const AppWrapper = () => {
  const location = useLocation();
  
  return (
    <>
      {location.pathname !== '/' && <Header />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/selection-screen" element={<SelectionScreen />} />
        <Route path="/game-started" element={<GameStartedScreen />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <DataProvider>
      <Router>
        <AppWrapper />
      </Router>
    </DataProvider>
  );
}

export default App;
