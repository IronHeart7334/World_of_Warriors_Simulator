import {View} from       "./view.js";
import {Controller} from "../controller.js";

export class MainMenu extends View{
    constructor(){
        super();
    }
    linkToPage(){
        $("#HowToPlayButton").click(()=>{
            alert("How to play not implemented yet");
        });
        $("#FightButton").click(()=>{
            this.getController().setView(Controller.TEAM_SELECT);
        });
        $("#TeamBuilderButton").click(()=>{
            this.getController().setView(Controller.TEAM_BUILDER);
        });
        $("#InfoButton").click(()=>{
            alert("Info not implemented yet");
        });
    }
}