import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { io } from 'socket.io-client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
const socket = io('http://localhost:8000/ai-support', {
  query: {
    apiKey: 'demo-key',
    group: 'demo-group',
    subGroup: 'demo-subgroup',
  },
  transports: ['websocket'],
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
  socket.emit('join-room', {roomId: 'demo-group-default'},()=>{
    socket.on('joined-room', (room) => {
      console.log('Joined room:', room);
    });
  });

});

socket.on('message', (msg) => {
  console.log('Received message:', msg);
});





socket.emit('message', { text: 'Hello from client', sender: 'user', timestamp: Date.now() });
*/