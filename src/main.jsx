import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function renderMyWidget(element) {
  ReactDOM.createRoot(element).render(<App />);
}

(function () {
  const container = document.createElement('div');
  document.body.appendChild(container);
  renderMyWidget(container);
})();