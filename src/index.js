import React from 'react';
import ReactDOM from 'react-dom/client';

import './static/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import {ToastContainer} from "react-toastify";


const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <App />
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            limit={5}
        />
    </React.StrictMode>
);

reportWebVitals(console.log);
