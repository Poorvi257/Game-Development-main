import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from "./components/HomeScreen";
import SelectionScreen from "./components/SelectionScreen";
import GameStartedScreen from "./components/GameStartedScreen";
import LoginPage from './components/LoginPage';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/selection-screen" element={<SelectionScreen />} />
          <Route path="/game-started" element={<GameStartedScreen />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
