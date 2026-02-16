// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; 
import App from './App.jsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faUserCircle, faSignOutAlt);
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { LanguageProvider } from "./contexts/LanguageContext";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </I18nextProvider>
    </LanguageProvider>
  </React.StrictMode>
);
