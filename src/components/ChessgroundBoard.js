import React, { useEffect, useRef, useState} from 'react';
import { Chessground } from 'chessground';
import '../assets/chessground.base.css';
import '../assets/chessground.brown.css';
import '../assets/chessground.cburnett.css';
import '../assets/chessground.custom.css';

function ChessgroundBoard({ fen, onMove }) {
  const chessgroundRef = useRef(null);
  const { highlightedSquares, setHighlightedSquares } = useHighlightSquares();

  useEffect(() => {
    if (chessgroundRef.current) {
      const chessground = Chessground(chessgroundRef.current, {
        fen: fen,
        movable: {
          free: false,
          color: 'both',
          dests: new Map(),
          events: {
            after: (orig, dest, metadata) => {
              onMove(orig, dest, metadata.promotion);
              setHighlightedSquares({ from: orig, to: dest });
            },
          },
        },
        premovable: {
          enabled: false,
        },
        highlight: {
          lastMove: true,
          check: true,
          checkmate: true,
          squares: highlightedSquares,
        },
      });

      return () => {
        // Clean up the Chessground instance on unmount
        chessground.destroy();
      };
    }
  }, [fen, onMove, chessgroundRef, highlightedSquares, setHighlightedSquares]);

  return (
    <div
      ref={chessgroundRef}
      className="cg-container"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function useHighlightSquares() {
  const [highlightedSquares, setHighlightedSquares] = React.useState({
    from: null,
    to: null,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHighlightedSquares({ from: null, to: null });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { highlightedSquares, setHighlightedSquares };
}

export default ChessgroundBoard;