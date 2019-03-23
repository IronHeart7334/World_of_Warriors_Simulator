import {Canvas} from "./graphics.js";
import {MainMenu} from "./gui/mainMenu.js";
import {WarriorCard} from "./gui/warriorCard.js";
import {Warrior} from "./warrior/warrior.js";
import {TeamBuilder} from "./gui/teamBuilder.js";

/*
let menu = new MainMenu();
menu.addChild(new WarriorCard(0, 0, 100, new Warrior("Yada", [])));
menu.setCanvas("canvas");
menu.draw();
*/

export function setPage(gamePane){
    let page = gamePane;
    page.setCanvas("canvas");
    page.draw();
}

let user = new GlobalObject();
//populate this

setPage(new TeamBuilder());