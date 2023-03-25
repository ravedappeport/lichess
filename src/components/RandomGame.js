// This file contains the RandomGame component which fetches and displays a random game
// from the selected player and variant.

import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { fetchRandomGame } from '../api/lichess';
import { Chess } from 'chess.js';

const RandomGame = () => {
  const [game, setGame] = useState(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [chess, setChess] = useState(new Chess());
  const [playerInfo, setPlayerInfo] = useState(null);

  useEffect(() => {
    getRandomGame();
  }, []);

  useEffect(() => {
    if (game) {
      setPlayerInfo(Object.values(game.players));
      loadPGN(game.pgn);
    }
  }, [game]);

  async function getRandomGame() {
    const response = await fetchRandomGame();
    setGame(response);
  }

  function loadPGN(pgn) {
    chess.loadPgn(pgn);
    // console.log(chess.fen())
    const currentPosition = chess.fen();
    setChess(currentPosition);
  }

  function handleMoveForward() {
    if (currentMove < chess.history().length - 1) {
      setCurrentMove(currentMove + 1);
      chess.move(chess.history({ verbose: true })[currentMove]);
      const currentPosition = chess.fen();
      setChess(currentPosition);
    }
  }

  function handleMoveBackward() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
      chess.undo();
      const currentPosition = chess.fen();
      setChess(currentPosition);
    }
  }

  if (!game || !playerInfo) {
    return <div>Loading...</div>;
  }

  console.log(game)
  console.log(playerInfo)
  return (
    <div className="random-game">
      <h1>Random Chess Game</h1>
      <div>
        <button onClick={handleMoveBackward}>Previous move</button>
        <button onClick={handleMoveForward}>Next move</button>
      </div>
      <Chessboard position={chess.fen} />
      <div>
        {playerInfo.map((player, index) => (
          <div key={index}>
            <h2>{player.name}</h2>
            <p>Rating: {player.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RandomGame;
