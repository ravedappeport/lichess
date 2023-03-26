// This file contains the RandomGame component which fetches and displays a random game
// from the selected player and variant.

import React, { useState, useEffect, useRef } from 'react';
// import { Chessboard } from 'react-chessboard';
import ChessgroundBoard from './ChessgroundBoard';
import { fetchRandomGame } from '../api/lichess';
import { Chess } from 'chess.js';
import MoveHistory from './MoveHistory';


const RandomGame = () => {
  const [game, setGame] = useState(null);
  const [currentMove, setCurrentMove] = useState(0);
  const chess = useRef(new Chess());
  const [playerInfo, setPlayerInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState("");
  const [moves, setMoves] = useState([]); 
  const [lastMoveFrom, setLastMoveFrom] = useState(null);
  const [lastMoveTo, setLastMoveTo] = useState(null);


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

  function handleMove(from, to) {
    chess.current.move({ from, to, promotion: 'q' });
    const fen = chess.current.fen();
    setCurrentPosition(fen);
  
    setLastMoveFrom(from);
    setLastMoveTo(to);
  }
  
  function handleMoveForward() {
    if (currentMove < moves.length - 1) {
      setCurrentMove(currentMove + 1);
  
      // if (currentMove === 0) {
      //   chess.current.load('start'); // reset the board to the starting position
      // }
  
      const move = chess.current.move(moves[currentMove], { sloppy: true });
  
      if (!move) {
        console.error(`Invalid move: ${moves[currentMove]}`);
        return;
      }
  
      const currentPosition = chess.current.fen();
      setCurrentPosition(currentPosition);
    }
  }
  
  function handleMoveBackward() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
  
      if (currentMove === moves.length - 1) {
        chess.current.load('start'); // reset the board to the starting position
      }
  
      chess.current.undo();
      const currentPosition = chess.current.fen();
      setCurrentPosition(currentPosition);
    }
  }
    

  /* reset the game to a point in time in the move history */
  const handleMovePairClick = (index) => {
    // setCurrentMove(index);
    chess.current.reset();

    for (let i = 0; i <= index; i++) {
      chess.current.move(moves[i], { sloppy: true });
      setCurrentMove(i);
    }

    const currentPosition = chess.current.fen();
    setCurrentPosition(currentPosition);
  };
  
  

  function handleReset() {
    setCurrentMove(0);
    chess.current.reset();
    const currentPosition = chess.current.fen();
    setCurrentPosition(currentPosition);
  }  

  const handleNewRandomGame = async () => {
    // Fetch a new random game and update the component state accordingly
    const newGame = await fetchRandomGame();
    setGame(newGame.game);
    setPlayerInfo(newGame.players);
    setMoves(newGame.moves);
    setCurrentMove(0);
    setCurrentPosition("start"); // Set the initial position to the start
  };  
  
  if (!game || !playerInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="random-game">
      <div className="random-game-header">
        <h1>Random Top Lichess Games</h1>
        <p>Only rated games by players currently considered top 10 in bullet, blitz, classic, or rapid chess variants</p>
      </div>
      <div className="game-container">
        <div className="game-info-container">
          <div className="game-info">
            {playerInfo.map((player, index) => (
              <div key={index}>
                <h3>{player.user.name}</h3>
                <p>Title: {player.user.title}</p>
                <p>Rating: {player.rating}</p>
                <p>Playing: {index === 0 ? 'White' : 'Black'}</p>
              </div>
            ))}
            <p>Game type: {game.speed}</p>
            <p>Game Winner: {game.winner}</p>
            <p>Game outcome: {game.status}</p>
          </div>
        </div>
        <div className="game-board-container">
          <div className="game-board-wrapper">
          <ChessgroundBoard
            fen={currentPosition}
            onMove={handleMove}
            lastMoveFrom={lastMoveFrom}
            lastMoveTo={lastMoveTo}
            className="game-board"
            style={{ width: '100%', height: '100%' }}
            />
            <div className="game-controls">
            <button onClick={handleNewRandomGame}>Pull New Game</button>
              <button onClick={handleReset}>Reset</button>
              <button onClick={handleMoveBackward}>Previous move</button>
              <button onClick={handleMoveForward}>Next move</button>
            </div>
          </div>
          <div className="move-history-container">
            <MoveHistory moves={moves} currentMove={currentMove} handleMovePairClick={handleMovePairClick} />
          </div>
        </div>
      </div>
    </div>
  );    
};

export default RandomGame;
