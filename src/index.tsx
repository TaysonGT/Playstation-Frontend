import {StrictMode} from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import axios from 'axios';
import Cookies from 'js-cookie'
import './i18n';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
axios.interceptors.request.use(config => {
   const accessToken = Cookies.get('access_token');
   
   if(!accessToken) return config;
   
   config.headers.Authorization = `Bearer ${accessToken}`;

   return config;
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
      <App />
  </StrictMode>,
)
