import React from 'react';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="App">
      <ChatWidget
        apiKey="demo-key"
        group="demo-group"
        historyBaseUrl="http://localhost:5000"
        chatBaseUrl="http://localhost:8000/ai-support" // ai-support service
        onMessageSent={() => {}}
        onError={() => {}}
      />
    </div>
  );
}

export default App;
