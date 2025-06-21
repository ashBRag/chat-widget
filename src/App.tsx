import React from 'react';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="App">
      <ChatWidget
        apiKey="demo-key"
        group="demo-group"
        baseUrl="wss://example.com"
        onMessageSent={() => {}}
        onError={() => {}}
      />
    </div>
  );
}

export default App;
