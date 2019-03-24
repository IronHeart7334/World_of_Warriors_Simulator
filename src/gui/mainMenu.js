import {GamePane} from "./gamePane.js";
import {Button} from   "./button.js";
import {Controller} from "../controller.js";

export class MainMenu extends GamePane{
    constructor(){
        super();
        this.addChild(this.howToPlayButton());
        this.addChild(this.fightButton());
        this.addChild(this.teamBuilderButton());
        this.addChild(this.infoButton());
        //add help button
    }
    
    howToPlayButton(){
        let ret = new Button("How to play");
        ret.setPos(0, 0);
        ret.setSize(25, 100);
        ret.setColor("green");
        ret.addOnClick(()=>{
            console.log("How to play not created yet");
        });
        return ret;
    }
    
    fightButton(){
        let ret = new Button("Fight!");
        ret.setPos(25, 0);
        ret.setSize(25, 100);
        ret.setColor("red");
        ret.addOnClick(()=>{
            this.controller.setView(Controller.TEAM_SELECT);
        });
        return ret;
    }
    
    teamBuilderButton(){
        let ret = new Button("Teambuilder");
        ret.setPos(50, 0);
        ret.setSize(25, 100);
        ret.setColor("blue");
        ret.addOnClick(()=>{
            this.controller.setView(Controller.TEAM_BUILDER);
        });
        return ret;
    }
    
    infoButton(){
        let ret = new Button("Info");
        ret.setPos(75, 0);
        ret.setSize(25, 100);
        ret.setColor("yellow");
        ret.addOnClick(()=>{
            console.log("Info not created yet");
        });
        return ret;
    }
}
