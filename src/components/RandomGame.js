// This file contains the RandomGame component which fetches and displays a random game
// from the selected player and variant.

import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { fetchRandomGame } from '../api/lichess';
import { Chess } from 'chess.js';

const RandomGame = () => {
  const [game, setGame] = useState(null);
  const [currentMove, setCurrentMove] = useState(0);
  const chess = useRef(new Chess());
  const [playerInfo, setPlayerInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState("");

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
    chess.current.loadPgn(pgn);
    const currentPosition = chess.current.fen();
    setCurrentPosition(currentPosition);
  }

  function handleMoveForward() {
    if (currentMove < chess.current.history().length - 1) {
      setCurrentMove(currentMove + 1);
      chess.current.move(chess.current.history({ verbose: true })[currentMove]);
      const currentPosition = chess.current.fen();
      setCurrentPosition(currentPosition);
    }
  }
  
  function handleMoveBackward() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
      chess.current.undo();
      const currentPosition = chess.current.fen();
      setCurrentPosition(currentPosition);
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
      <Chessboard position={currentPosition} />
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
