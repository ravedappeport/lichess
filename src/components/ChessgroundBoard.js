import React, { useEffect, useRef } from 'react';
import { Chessground } from 'chessground';
import '../assets/chessground.css';

function ChessgroundBoard({ fen, onMove }) {
  const chessgroundRef = useRef(null);

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
            },
          },
        },
        premovable: {
          enabled: false,
        },
      });

      return () => {
        // Clean up the Chessground instance on unmount
        chessground.destroy();
      };
    }
  }, [fen, onMove, chessgroundRef]);

  return <div ref={chessgroundRef} className="chessground-container" />;
}

export default ChessgroundBoard;
