import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navigation from './Navigation';
import { store } from './Redux Toolkit/store';
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Navigation />
    </Provider>
);
