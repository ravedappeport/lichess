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
  const [moves, setMoves] = useState([]); // Add this line

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
    setGame(response.game);
    setMoves(response.moves);
    setCurrentPosition("start"); // Set the initial position to the start
  }
  
  function loadPGN(pgn) {
    chess.current.loadPgn(pgn, { sloppy: true });
    chess.current.reset(); 
    const currentPosition = chess.current.fen();
    setCurrentPosition(currentPosition);
  }
  
  

  function handleMoveForward() {
    if (currentMove < moves.length - 1) {
      setCurrentMove(currentMove + 1);
      chess.current.move(moves[currentMove], { sloppy: true });
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
