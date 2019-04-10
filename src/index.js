import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "./redux/store/index";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

import "assets/scss/black-dashboard-react.scss";
import "assets/css/bcp.css";
import "assets/css/nucleo-icons.css";

import App from './App';

const hist = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={hist}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
