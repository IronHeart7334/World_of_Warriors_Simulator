import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ReactApp';
import * as serviceWorker from './serviceWorker';


import {MainMenu} from "./gui/reactMainMenu.js";
import {ReactController} from "./gui/reactController.js";


//ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<MainMenu />, document.getElementById('root'));
ReactDOM.render(<ReactController/>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
