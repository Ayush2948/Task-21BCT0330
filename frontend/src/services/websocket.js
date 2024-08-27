let socket;

export function connectWebSocket(url) {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // Dispatch the original event data as a JSON string
      window.dispatchEvent(new MessageEvent('message', { data: event.data }));
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
}

export function sendMessage(message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
