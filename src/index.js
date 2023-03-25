import React from 'react';
import ReactDOM from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (!('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
