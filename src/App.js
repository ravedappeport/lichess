// This file contains the App component which is the main entry point of the application.
// It renders the RandomGame component.

import React from 'react';
import './App.css';
import RandomGame from './components/RandomGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Chess Game</h1>
      </header>
      <RandomGame />
    </div>
  );
}

export default App;
