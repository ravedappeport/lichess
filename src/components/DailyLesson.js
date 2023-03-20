import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { getDailyPuzzle } from './api/lichess';
import { Chess } from 'chess.js';

const DailyLesson = () => {
  const [dailyPuzzle, setDailyPuzzle] = useState(null);
  const [chess, setChess] = useState(new Chess());
  const [position, setPosition] = useState('start');

  useEffect(() => {
    async function fetchDailyPuzzle() {
      const puzzle = await getDailyPuzzle();
      setDailyPuzzle(puzzle);
      setPosition(puzzle.fen);
      chess.load(puzzle.fen);
    }

    fetchDailyPuzzle();
  }, []);

  const onMove = (move) => {
    // Check if the move is legal
    const newMove = chess.move({ from: move.sourceSquare, to: move.targetSquare });

    if (newMove === null) {
      // If the move is not legal, prevent it
      return false;
    } else {
      // If the move is legal, update the position
      setPosition(chess.getFen());
    }
  };

  return (
    <>
      {dailyPuzzle && (
        <div>
          <h2>{dailyPuzzle.title}</h2>
          <p>{dailyPuzzle.description}</p>
          <Chessboard position={position} onMove={onMove} />
        </div>
      )}
    </>
  );
};

export default DailyLesson;
