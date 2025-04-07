import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import process from 'process';
window.process = process;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
