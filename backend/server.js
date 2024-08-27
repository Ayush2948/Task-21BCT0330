const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const gameLogic = require('./gameLogic');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Store game state and players
let gameState = {
  board: [],
  players: [],
  currentTurn: null,
};

// Initialize the game board
function initializeBoard() {
  const board = [];
  for (let i = 0; i < 5; i++) {
    board[i] = [];
    for (let j = 0; j < 5; j++) {
      board[i][j] = null;
    }
  }
  return board;
}

// Initialize the game state
function initializeGame() {
  gameState.board = initializeBoard();
  gameState.players = [];
  gameState.currentTurn = null;
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    handleMessage(ws, data);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Handle player disconnection
    gameState.players = gameState.players.filter(player => player.ws !== ws);
    broadcastGameState();
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Handle incoming messages
function handleMessage(ws, data) {
  if (data.type === 'join') {
    handleJoin(ws, data);
  } else if (data.type === 'move') {
    handleMove(ws, data);
  }
}

// Handle player joining the game
function handleJoin(ws, data) {
  const player = { id: data.playerId, ws: ws };
  gameState.players.push(player);
  console.log(`Player ${player.id} joined the game`);
  if (gameState.players.length === 2) {
    gameState.currentTurn = gameState.players[0].id;
    broadcastGameState();
  }
}

// Handle player move
function handleMove(ws, data) {
  const { playerId, from, to } = data;
  if (gameState.currentTurn === playerId) {
    // Validate and execute move
    const isValidMove = gameLogic.validateMove(gameState.board, from, to);
    if (isValidMove) {
      gameLogic.executeMove(gameState.board, from, to);
      gameState.currentTurn = gameState.players.find(p => p.id !== playerId).id;
      broadcastGameState();
    } else {
      console.log(`Invalid move by player ${playerId}`);
    }
  }
}

// Broadcast the game state to all players
function broadcastGameState() {
  const message = JSON.stringify({ type: 'gameState', data: gameState });
  gameState.players.forEach(player => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(message);
    }
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  initializeGame();
});
