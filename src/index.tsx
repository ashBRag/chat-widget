import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from 'styled-components';

const darkTheme = {
  background: '#18181b',
  header: '#1e293b',
  headerText: '#fff',
  bubbleUser: '#2563eb',
  bubbleBot: '#27272a',
  bubbleUserText: '#fff',
  bubbleBotText: '#e5e7eb',
  inputBg: '#27272a',
  inputBorder: '#3f3f46',
  inputText: '#fff',
  statusOnline: '#22c55e',
  statusOffline: '#ef4444',
};
const lightTheme = {
  background: '#fff',
  header: '#f0f0f0',
  headerText: '#000',
  bubbleUser: '#2563eb',
  bubbleBot: '#f0f0f0',
  bubbleUserText: '#fff',
  bubbleBotText: '#000',
  inputBg: '#f0f0f0',
  inputBorder: '#d1d5db',
  inputText: '#000',
  statusOnline: '#22c55e',
  statusOffline: '#ef4444',
};
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
