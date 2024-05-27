// index.js or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PlayerContextProvider } from './Context/PlayerContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PlayerContextProvider>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </PlayerContextProvider>
  </React.StrictMode>,
);
