import {Canvas} from "./graphics.js";
import {MainMenu} from "./gui/mainMenu.js";
import {WarriorCard} from "./gui/warriorCard.js";
import {Warrior} from "./wow_warrior_class.js";

//dispMenu();
//document.getElementById("canvas").onclick = checkClick(event);
let canvas = new Canvas("canvas");
let menu = new MainMenu();

menu.addChild(new WarriorCard(0, 0, 100, new Warrior("Toki", [])));

menu.setClickListener("canvas");
menu.draw(canvas);