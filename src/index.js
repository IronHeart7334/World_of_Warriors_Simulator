import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ReactApp';
import * as serviceWorker from './serviceWorker';

import {GlobalObject} from "./globalObject.js";
import {Controller} from "./controller.js";
import {warriors} from "./warrior/realWarriors.js";
import {Team} from "./warrior/team.js";
import {Warrior} from "./warrior/warrior.js";

import {CriticalHit, Guard} from "./warrior/warriorSkills.js";

let user = new GlobalObject();
user.warriors = warriors;
user.teams = [
    new Team("Starter Team", [
        new Warrior("Abu"), 
        new Warrior("Toki"), 
        new Warrior("Zenghis")
    ]),
    new Team("Arena Favorites", [
        new Warrior("Ironhart"), 
        new Warrior("Erika"), 
        new Warrior("Boris")
    ])
];
user.teams[0].members[0].addSkill(new CriticalHit());
user.teams[0].members[1].addSkill(new Guard());

let controller = new Controller();
controller.setUser(user);
//controller.setCanvas("canvas");
//controller.setView(Controller.MAIN_MENU);

ReactDOM.render(<App />, document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
