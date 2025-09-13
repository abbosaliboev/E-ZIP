import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons
import 'leaflet/dist/leaflet.css'; // Leaflet CSS

// Bootstrap CSS (birinchi!)
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
// Global SCSS (custom theme)
import './styles/global.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);