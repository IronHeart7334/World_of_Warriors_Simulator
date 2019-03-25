import {GamePane} from "./gamePane.js";
import {Button} from "./button.js";
import {Controller} from "../controller.js";

export class TeamSelect extends GamePane{
    constructor(){
        super();
        this.user = null;
        this.team1 = null;
        this.team2 = null;
        this.fight = this.fightButton();
        this.addChild(this.fight);
        this.addChild(this.backButton());
    }
    
    setController(controller){
        super.setController(controller);
        this.user = controller.user;
        
        this.team1 = this.user.teams[0];
        this.team2 = this.user.teams[1];
        
        let x1 = 10;
        let x2 = 50;
        let y1 = 10;
        let y2 = 10;
        let button;
        this.user.teams.forEach((team)=>{
            button = new Button(team.name);
            button.setPos(x1, y1);
            button.setSize(10, 10);
            button.setColor("blue");
            button.addOnClick(()=>{
                this.team1 = team;
                this.update();
            });
            y1 += 10;
            if(y1 >= 90){
                y1 = 10;
                x1 += 10;
            }
            this.addChild(button);
            
            button = new Button(team.name);
            button.setPos(x2, y2);
            button.setSize(10, 10);
            button.setColor("blue");
            button.addOnClick(()=>{
                this.team2 = team;
                this.update();
            });
            y2 += 10;
            if(y2 >= 90){
                y2 = 10;
                x2 += 10;
            }
            this.addChild(button);
        });
        this.draw();
    }
    
    fightButton(){
        let ret = new Button("VS");
        ret.setPos(0, 90);
        ret.setSize(100, 10);
        ret.setColor("green");
        ret.addOnClick(()=>{
            console.log(this.team1);
            console.log(this.team2);
        });
        return ret;
    }
    
    backButton(){
        let ret = new Button("Back");
        ret.setPos(0, 0);
        ret.setSize(100, 10);
        ret.setColor("red");
        ret.addOnClick(()=>{
            this.controller.setView(Controller.MAIN_MENU);
        });
        return ret;
    }
    
    update(){
        this.fight.setText(this.team1.name + " VS " + this.team2.name + ". Fight!");
        this.draw();
    }
}