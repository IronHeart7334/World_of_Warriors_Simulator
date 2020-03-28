import {User} from "./util/user.js";
import {Controller} from "./controller.js";
import {warriors} from "./warrior/realWarriors.js";
import {Team} from "./warrior/team.js";
import {Warrior} from "./warrior/warrior.js";

import {CriticalHit, Guard} from "./warrior/warriorSkills.js";

import {getModuleList} from "./util/import.js";

let user = new User();
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
user.loadModules();
getModuleList().then((list)=>{
    console.log(list);
    //need to use then, as 'await' doesn't work, given that this isn't wrapped in an async function
});
//user.teams[0].members[0].addSkill(new CriticalHit());
//user.teams[0].members[1].addSkill(new Guard());

let controller = new Controller();
controller.setUser(user);
controller.setView(Controller.MAIN_MENU);
