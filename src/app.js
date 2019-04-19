import {GlobalObject} from "./globalObject.js";
import {Controller} from "./controller.js";
import {warriors} from "./warrior/realWarriors.js";
import {Team} from "./warrior/team.js";

import {CriticalHit} from "./warrior/skills/criticalHit.js";

let user = new GlobalObject();
user.warriors = warriors;
user.teams = [
    new Team("Starter Team", ["Abu", "Toki", "Zenghis"]),
    new Team("Arena Favorites", ["Ironhart", "Erika", "Boris"])
];
user.teams[0].members[0].addSkill(new CriticalHit());

let controller = new Controller();
controller.setUser(user);
controller.setCanvas("canvas");
controller.setView(Controller.MAIN_MENU);