import {GlobalObject} from "./globalObject.js";
import {Controller} from "./controller.js";
import {warriors} from "./warrior/realWarriors.js";

let user = new GlobalObject();
user.warriors = warriors;


let controller = new Controller();
controller.setUser(user);
controller.setCanvas("canvas");
controller.setView(Controller.MAIN_MENU);