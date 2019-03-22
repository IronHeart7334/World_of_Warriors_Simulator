import {Canvas} from "./graphics.js";
import {MainMenu} from "./gui/mainMenu.js";
import {WarriorCard} from "./gui/warriorCard.js";
import {Warrior} from "./warrior/warrior.js";

//dispMenu();
//document.getElementById("canvas").onclick = checkClick(event);
let canvas = new Canvas("canvas");
let menu = new MainMenu();

menu.addChild(new WarriorCard(0, 0, 100, new Warrior("Yada", [])));

menu.setClickListener("canvas");
menu.draw(canvas);