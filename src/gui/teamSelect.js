import {GamePane} from "./gamePane.js";
import {Button} from "./button.js";
import {Controller} from "../controller.js";

export class TeamSelect extends GamePane{
    constructor(){
        super();
        this.user = null;
        this.team1 = null;
        this.team2 = null;
        this.addChild(this.backButton());
    }
    
    setController(controller){
        super.setController(controller);
        this.user = controller.user;
        
        let x1 = 10;
        let x2 = 50;
        let y1 = 0;
        let y2 = 0;
        let button;
        this.user.teams.forEach((team)=>{
            button = new Button(team.name);
            button.setPos(x1, y1);
            button.setSize(10, 10);
            button.setColor("blue");
            button.addOnClick(()=>{
                this.team1 = team;
            });
            y1 += 10;
            if(y1 >= 90){
                y1 = 10;
                x1 += 10;
            }
            this.addChild(button);
        });
        this.draw();
    }
    
    backButton(){
        let ret = new Button("Back");
        ret.setPos(0, 0);
        ret.setSize(10, 10);
        ret.setColor("red");
        ret.addOnClick(()=>{
            this.controller.setView(Controller.MAIN_MENU);
        });
        return ret;
    }
}