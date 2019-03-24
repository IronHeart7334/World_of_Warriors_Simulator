import {GamePane} from "./gamePane.js";
import {Button} from   "./button.js";
import {WarriorCard} from "./warriorCard.js";
import {Warrior, Team} from "../warrior/warrior.js";
import {Controller} from "../controller.js";

export class TeamBuilder extends GamePane{
    constructor(){
        super();
        this.user = null;
        //cannot add warriors initially; need to wait until user is set
        this.teamWorkshop = [];
        this.currIdx = 0;
        this.options = ["Toki"];
        this.addChild(this.leftButton());
        this.addChild(this.rightButton());
        this.addChild(this.selectButton());
    }
    
    setController(controller){
        super.setController(controller);
        this.user = controller.user;
        this.currIdx = Math.round(this.user.warriors.length / 2);
        this.options = this.user.warriors.map((data)=>data[0]);
        this.update();
    }
    
    leftButton(){
        let ret = new Button("Previous warrior");
        ret.setPos(0, 75);
        ret.setSize(25, 25);
        ret.setColor("blue");
        ret.addOnClick(()=>{
            if(this.currIdx > 0){
                this.currIdx--;
                this.update();
            }
        });
        return ret;
    }
    
    rightButton(){
        let ret = new Button("Next warrior");
        ret.setPos(75, 75);
        ret.setSize(25, 25);
        ret.setColor("green");
        ret.addOnClick(()=>{
            if(this.currIdx < this.options.length - 1){
                this.currIdx++;
                this.update();
            }
        });
        return ret;
    }
    
    selectButton(){
        let ret = new Button("Choose this warrior");
        ret.setPos(25, 75);
        ret.setSize(50, 25);
        ret.setColor("yellow");
        ret.addOnClick(()=>{
            this.selectWarrior(this.options[this.currIdx]);
        });
        return ret;
    }
    
    selectWarrior(name){
        //todo: skill selection
        this.teamWorkshop.push(name);
        this.options.splice(this.options.indexOf(name), 1);
        this.currIdx--;
        
        if(this.teamWorkshop.length === 3){
            let teamName = prompt("What do you want to call this team?");
            //save the team
            //                                                 V-- skills would go here 
            let members = this.teamWorkshop.map((name)=>[name, []]);
            this.user.teams.push(new Team(teamName, members));
            console.log(this.user.teams);
            this.controller.setView(Controller.MAIN_MENU);
        } else {
            this.update();
        }
    }
    
    update(){
        //clear warrior cards. Better way?
        let newChildren = this.children.filter((child)=>!(child instanceof WarriorCard));
        this.children = newChildren;
        
        if(this.currIdx !== 0){
            let leftCard = new WarriorCard(0, 0, 25);
            leftCard.setWarrior(new Warrior(this.options[this.currIdx - 1]));
            this.addChild(leftCard);
        }
        
        let midCard = new WarriorCard(25, 0, 50);
        midCard.setWarrior(new Warrior(this.options[this.currIdx]));
        this.addChild(midCard);
        
        if(this.currIdx !== this.options.length - 1){
            let rightCard = new WarriorCard(75, 0, 25);
            rightCard.setWarrior(new Warrior(this.options[this.currIdx + 1]));
            this.addChild(rightCard);
        }
        
        if(this.canvas){
            this.draw();
        }
    }
}
