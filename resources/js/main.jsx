import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../css/app.css'; // Import the CSS file with Tailwind styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);