// This file now includes two functions: 
// getTopPlayers and getRandomGame. getTopPlayers fetches the top 10 players 
// for each game variation, while getRandomGame fetches a random game from a specified player and game variation.

import axios from 'axios';

const API_BASE_URL = 'https://lichess.org/api';

export async function fetchTopPlayers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/player`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top players:', error);
    return null;
  }
}

export async function fetchRandomGame() {
  try {
    const topPlayersAllCategories = await fetchTopPlayers();
    if (!topPlayersAllCategories) {
      return null;
    }

    const gameVariant = getRandomGameVariant();
    const randomPlayer = getRandomPlayer(topPlayersAllCategories, gameVariant);

    const response = await axios.get(
      `${API_BASE_URL}/games/user/${randomPlayer}`,
      {
        params: {
          variant: gameVariant,
          max: 1,
          color: 'random',
          pgnInJson: true,
          opening: true,
          literate: true, /* see https://lichess.org/api#tag/Games/operation/apiGamesUser */
          rated: true, /* see https://lichess.org/api#tag/Games/operation/apiGamesUser */
        }, 
        headers: {
          Accept: 'application/x-ndjson',
        },
      }
    );
  
  return {
    game: response.data,
    moves: response.data.moves.split(' '),
  }

  } catch (error) {
    console.error('Error fetching random game:', error);
    return null;
  }
}

// helper function
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// get random game variant supported by chess.js
function getRandomGameVariant() {
  const supportedVariants = ['bullet', 'blitz', 'rapid', 'classical'];
  return getRandomElement(supportedVariants);
}

// get random top player
function getRandomPlayer(topPlayersAllCategories, variant) {
  const Category = topPlayersAllCategories[variant];
  const players = Object.keys(Category)
  const randomIndex = Math.floor(Math.random() * players.length);
  return Category[randomIndex].id;
}

