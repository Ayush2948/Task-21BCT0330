// gameLogic.js

const CHARACTER_TYPES = {
    PAWN: 'Pawn',
    HERO1: 'Hero1',
    HERO2: 'Hero2',
  };
  
  const MOVEMENT_RULES = {
    [CHARACTER_TYPES.PAWN]: (from, to) => {
      // Pawns can move one step in any direction
      return Math.abs(from.x - to.x) + Math.abs(from.y - to.y) === 1;
    },
    [CHARACTER_TYPES.HERO1]: (from, to) => {
      // Hero1 can move two steps in any direction
      return Math.abs(from.x - to.x) + Math.abs(from.y - to.y) === 2;
    },
    [CHARACTER_TYPES.HERO2]: (from, to) => {
      // Hero2 can move diagonally
      return Math.abs(from.x - to.x) === Math.abs(from.y - to.y);
    },
  };
  
  // Initialize the game board with characters
  function initializeBoard() {
    const board = [];
    for (let i = 0; i < 5; i++) {
      board[i] = [];
      for (let j = 0; j < 5; j++) {
        board[i][j] = null;
      }
    }
    // Place characters on the board (example placement)
    board[0][0] = { type: CHARACTER_TYPES.PAWN, playerId: 'player1' };
    board[0][1] = { type: CHARACTER_TYPES.HERO1, playerId: 'player1' };
    board[0][2] = { type: CHARACTER_TYPES.HERO2, playerId: 'player1' };
    board[4][4] = { type: CHARACTER_TYPES.PAWN, playerId: 'player2' };
    board[4][3] = { type: CHARACTER_TYPES.HERO1, playerId: 'player2' };
    board[4][2] = { type: CHARACTER_TYPES.HERO2, playerId: 'player2' };
    return board;
  }
  
  // Validate a move
  function validateMove(board, from, to) {
    const character = board[from.x][from.y];
    if (!character) {
      return false;
    }
    const movementRule = MOVEMENT_RULES[character.type];
    if (!movementRule(from, to)) {
      return false;
    }
    // Check if the destination is within bounds and not occupied by another character
    if (to.x < 0 || to.x >= 5 || to.y < 0 || to.y >= 5 || board[to.x][to.y] !== null) {
      return false;
    }
    return true;
  }
  
  // Execute a move
  function executeMove(board, from, to) {
    const character = board[from.x][from.y];
    board[from.x][from.y] = null;
    board[to.x][to.y] = character;
  }
  
  // Check if the game is over
  function isGameOver(board, playerId) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (board[i][j] && board[i][j].playerId === playerId) {
          return false;
        }
      }
    }
    return true;
  }
  
  module.exports = {
    CHARACTER_TYPES,
    initializeBoard,
    validateMove,
    executeMove,
    isGameOver,
  };
  