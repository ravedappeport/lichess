import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { getDailyPuzzle } from '../api/lichess';
import { Chess } from 'chess.js';
import { useWindowSize } from '../hooks/useWindowSize';

const DailyLesson = () => {
  const [dailyPuzzle, setDailyPuzzle] = useState(null);
  const [chess, setChess] = useState(new Chess());
  const [position, setPosition] = useState('start');
  const [solutionMoves, setSolutionMoves] = useState([]);
  const size = useWindowSize();

  const calcWidth = ({ screenWidth, screenHeight }) => {
  return Math.min(screenWidth * 0.8, screenHeight * 0.8, 800);
  };

  useEffect(() => {
    async function fetchDailyPuzzle() {
      const puzzle = await getDailyPuzzle();
      setDailyPuzzle(puzzle);
      setPosition(puzzle.fen);
      chess.load(puzzle.fen);

      const moves = puzzle.solution.map((move) => chess.move(move));
      setSolutionMoves(moves);
      chess.load(puzzle.fen); // Reset the position
    }

    fetchDailyPuzzle();
  }, []);

  const onMove = (move) => {
    const newMove = chess.move({ from: move.sourceSquare, to: move.targetSquare });

    if (newMove === null) {
      return false;
    } else {
      setPosition(chess.getFen());

      if (solutionMoves.length > 0 && newMove.san === solutionMoves[0].san) {
        // If the move is correct, remove it from the remaining solution moves
        setSolutionMoves(solutionMoves.slice(1));
      } else {
        // If the move is incorrect, show an alert
        alert('Incorrect move. Please try again.');
        // Undo the incorrect move
        chess.undo();
        setPosition(chess.getFen());
      }
    }
  };

  return (
    <>
      {dailyPuzzle && (
        <div className="daily-lesson">
          <h2>{dailyPuzzle.title}</h2>
          <p>{dailyPuzzle.description}</p>
          <p>{dailyPuzzle.toMove} to move</p>
          <Chessboard position={position} onMove={onMove} calcWidth={calcWidth} />
        </div>
      )}
    </>
  );
};

export default DailyLesson;
