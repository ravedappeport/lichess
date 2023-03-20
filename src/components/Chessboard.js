import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const ChessboardComponent = (props) => {
    const [board, setBoard] = useState(() => new Chess().fen());
    const [game, setGame] = useState(null);

  useEffect(() => {
    setGame(new Chess());
  }, []);

  const handleMove = (move) => {
    const { from, to } = move;
  
    const chessMove = game.move({
      from,
      to,
      promotion: 'q',
    });
  
    if (chessMove === null) {
      return;
    }
  
    setBoard(game.fen());
  };
  

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Chessboard
        position={board}
        onMove={handleMove}
        boardSize={400}
        lightSquareColor="#f0d9b5"
        darkSquareColor="#b58863"
      />
    </div>
  );
};

export default ChessboardComponent;
