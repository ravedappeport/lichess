import React from 'react';

const MoveHistory = ({ moves, currentMove, handleMovePairClick }) => {
  const renderMoves = () => {
    const moveList = [];

    for (let i = 0; i < moves.length; i += 2) {
      const movePair = (
        <div
          key={i}
          className="move-pair"
          onClick={() => handleMovePairClick(i / 2)}
          style={{ cursor: 'pointer' }}
        >
          <span className="move-number">{(i / 2) + 1}.</span>
          <span className="move-white">{moves[i]}</span>
          {i + 1 < moves.length && <span className="move-black">{moves[i + 1]}</span>}
        </div>
      );
      moveList.push(movePair);
    }

    return moveList;
  };

  return (
    <div className="move-history">
      <h2>Move History</h2>
      <div className="move-list">{renderMoves()}</div>
    </div>
  );
};


export default MoveHistory;
