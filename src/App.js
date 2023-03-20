// import logo from './logo.svg';
import './App.css';

import ChessboardComponent from './components/Chessboard';
import DailyLesson from './components/DailyLesson';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chess Lessons</h1>
      </header>
      <main>
        <DailyLesson />
      </main>
    </div>
  );
}


export default App;
