import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // your global styles
import ReqNestSDK from "./pages/ReqNestSDK.jsx";

export default ReqNestSDK;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
