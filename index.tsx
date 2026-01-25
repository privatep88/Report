
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Declare globals if needed by other parts, though usually handled in types or contexts
declare global {
  interface Window {
    html2pdf: any;
    XLSX: any;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
