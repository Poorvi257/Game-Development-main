import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from "./components/HomeScreen";
import SelectionScreen from "./components/SelectionScreen";
import GameStartedScreen from "./components/GameStartedScreen";
import LoginPage from './components/LoginPage';
import { DataProvider } from './DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/selection-screen" element={<SelectionScreen />} />
          <Route path="/game-started" element={<GameStartedScreen />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
