import React, { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage } from '../services/websocket';

function Board() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    connectWebSocket('ws://localhost:3000');

    // Join the game
    sendMessage({ type: 'join', playerId: 'player1' });

    // Listen for game state updates
    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        console.log('Received data:', data); // Debugging line
        
        if (data.type === 'gameState') {
          console.log('Setting game state:', data.data); // Debugging line
          setGameState(data.data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Render the game board
  return (
    <div className="board">
      {gameState && gameState.board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="cell">
              {cell ? cell.type : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
