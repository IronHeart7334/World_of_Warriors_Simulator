import {MainMenu} from "./gui/mainMenu.js";
import {TeamBuilder} from "./gui/teamBuilder.js";
import {TeamSelect} from "./gui/teamSelect.js";
import {Canvas} from "./graphics.js";

//todo check if user is logged in
export class Controller{
    constructor(){
        this.user = null;
        this.view = null;
        this.canvas = null;
    }
    
    setUser(globalObject){
        this.user = globalObject;
    }
    
    setCanvas(elementId){
        this.canvas = new Canvas(elementId);
    };
    
    //view is an enum (Controller.MAIN_MENU, for example)
    setView(view){
        switch(view){
            case Controller.MAIN_MENU:
                this.view = new MainMenu();
                break;
            case Controller.TEAM_SELECT:
                if(this.user.teams.length < 2){
                    alert("You need at least 2 teams to battle");
                } else {
                    this.view = new TeamSelect();
                }
                break;
            case Controller.TEAM_BUILDER:
                this.view = new TeamBuilder();
                break;
            default:
                console.log("View not valid: " + view);
                break;
        }
        if(this.view){
            this.view.setController(this);
            this.view.setCanvas(this.canvas);//need this for checking click
            this.view.draw();
        }
    }
}
Controller.MAIN_MENU = 0;
Controller.TEAM_SELECT = 1;
Controller.TEAM_BUILDER = 2;
