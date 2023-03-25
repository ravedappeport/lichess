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
    const topPlayers = await fetchTopPlayers();
    if (!topPlayers) {
      return null;
    }

    const randomCategory = getRandomCategory(topPlayers);
    const randomPlayer = getRandomPlayer(randomCategory);

    const response = await axios.get(
      `${API_BASE_URL}/games/user/${randomPlayer}`,
      {
        params: {
          perfType: randomCategory.key,
          max: 1,
          color: 'random',
          pgnInJson: true,
          opening: true,
        }, 
        headers: {
          Accept: 'application/x-ndjson',
        },
      }
    );

   
    // console.log(response.data)
    // const game = response.data.pgn.split('\n')[0];
    // return JSON.parse(game);
    return (response.data)
  } catch (error) {
    console.error('Error fetching random game:', error);
    return null;
  }
}

function getRandomCategory(topPlayers) {
  const categories = Object.keys(topPlayers);
  const randomIndex = Math.floor(Math.random() * categories.length);
  return topPlayers[categories[randomIndex]];
}

function getRandomPlayer(Category) {
  const players = Object.keys(Category)
  const randomIndex = Math.floor(Math.random() * players.length);
  return Category[randomIndex].id;
}

