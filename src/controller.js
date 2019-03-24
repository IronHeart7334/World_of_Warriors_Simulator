import {MainMenu} from "./gui/mainMenu.js";
import {TeamBuilder} from "./gui/teamBuilder.js";

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
    
    //do I want just this to hold the canvas? 
    //or do I want each view to hold it as well?
    setCanvas(elementId){
        this.canvas = elementId;
    };
    
    //view is an enum (Controller.MAIN_MENU, for example)
    setView(view){
        switch(view){
            case Controller.MAIN_MENU:
                this.view = new MainMenu();
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
            this.view.setCanvas(this.canvas);
            this.view.draw();
        }
    }
}
Controller.MAIN_MENU = 0;
Controller.TEAM_BUILDER = 1;
