// This file now includes two functions: 
// getTopPlayers and getRandomGame. getTopPlayers fetches the top 10 players 
// for each game variation, while getRandomGame fetches a random game from a specified player and game variation.

import axios from 'axios';

const API_BASE_URL = 'https://lichess.org/api';

export const getTopPlayers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/player`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top players:', error);
    throw error;
  }
};

export const getRandomGame = async (player, perfType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games/user/${player}?max=1&rated=1&perfType=${perfType}`, {
      headers: { 'Content-Type': 'application/x-ndjson' },
      responseType: 'text',
    });
    const games = response.data.split('\n').filter((game) => game.length > 0).map((game) => JSON.parse(game));
    return games[0];
  } catch (error) {
    console.error('Error fetching random game:', error);
    throw error;
  }
};
