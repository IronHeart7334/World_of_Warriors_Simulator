import {GlobalObject} from "./globalObject.js";
import {Controller} from "./controller.js";
import {warriors} from "./warrior/realWarriors.js";
import {Team} from "./warrior/team.js";

let user = new GlobalObject();
user.warriors = warriors;
user.teams = [
    new Team("Starter Team", [["Abu", ["critical hit"]], ["Toki", ["critical hit"]], ["Zenghis", ["critical hit"]]]),
    new Team("Arena Favorites", [["Ironhart", ["shell"]], ["Erika", ["critical hit"]], ["Boris", ["critical hit"]]])
];


let controller = new Controller();
controller.setUser(user);
controller.setCanvas("canvas");
controller.setView(Controller.MAIN_MENU);