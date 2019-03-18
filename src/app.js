import {dispMenu} from "./menus.js";
import {checkClick} from "./utilities.js";

dispMenu();
document.getElementById("canvas").onclick = checkClick(event);
