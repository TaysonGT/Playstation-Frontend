import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import eruda from 'eruda'
import axios from 'axios';
import Cookies from 'js-cookie'

axios.defaults.baseURL = 'https://playstation-backend.onrender.com';
// axios.defaults.baseURL = 'http://localhost:5000';
axios.interceptors.request.use(config => {
   const accessToken = Cookies.get('access_token');
   const username = Cookies.get('username');
   const user_id = Cookies.get('user_id');

   config.headers.Authorization = `Bearer ${accessToken}`;
   config.headers.username = `Bearer ${username}`;
   config.headers.user_id = `Bearer ${user_id}`;

   return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);