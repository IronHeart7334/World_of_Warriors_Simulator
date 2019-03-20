import {Canvas} from "./graphics.js";
import {MainMenu} from "./gui/mainMenu.js";

//dispMenu();
//document.getElementById("canvas").onclick = checkClick(event);
let canvas = new Canvas("canvas");
let menu = new MainMenu();
menu.setClickListener("canvas");
menu.draw(canvas);