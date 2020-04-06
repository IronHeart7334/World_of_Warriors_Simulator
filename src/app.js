import {DEFAULT_USER} from "./util/user.js";
import {Controller} from "./controller.js";
import {Team} from "./warrior/team.js";
import {loadAllDataInto} from "./util/import.js";
import {Repository} from "./util/repository.js";

let user = DEFAULT_USER;

//need to use then, as 'await' doesn't work, given that this isn't wrapped in an async function
loadAllDataInto(user).then(()=>{
    /*
    user.getAllWarriors().forEach((w)=>{
        console.log(w.toString());
    });
    */
    /*
    user.getAllTeams().forEach((t)=>{
        console.log(t.toString());
    });
    */
    let controller = new Controller();
    controller.setUser(user);
    controller.setView(Controller.MAIN_MENU);
});
