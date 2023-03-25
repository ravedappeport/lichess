// This file contains the App component which is the main entry point of the application.
// It renders the RandomGame component.

import React from 'react';
import './App.css';
import './assets/randomgame.css';
import './assets/movehistory.css';
import RandomGame from './components/RandomGame';

function App() {
  return (
    <div className="App">
      <RandomGame />
    </div>
  );
}

export default App;
