import { Chess } from 'chess.js';

const getDailyPuzzle = async () => {
  const response = await fetch('https://lichess.org/api/puzzle/daily');
  const data = await response.json();

  const chess = new Chess();
  chess.loadPgn(data.game.pgn);
  for (let i = 0; i < data.puzzle.initialPly - chess.history().length; i++) {
    chess.forward(); // Go to the initial position of the puzzle
  }

  const dailyPuzzle = {
    title: `Daily Puzzle: ${data.puzzle.id}`,
    fen: chess.fen(), // Get the FEN for the puzzle position
    description: `Solution: ${data.puzzle.solution.join(', ')}`, // Format the solution
  };

  return dailyPuzzle;
};

export { getDailyPuzzle };
