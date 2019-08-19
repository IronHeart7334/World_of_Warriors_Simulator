import {Canvas} from "./canvas.js";
import {WarriorCard} from "./warriorCard.js";
import {Warrior} from "../warrior/warrior.js";
import {Team} from "../warrior/team.js";
import {Controller} from "../controller.js";

export class TeamBuilder{
    constructor(user){
        this.user = user;
        this.options = user.warriors.map((arr)=>arr[0]);
        this.currIdx = Number.parseInt(this.options.length / 2);
        this.canvases = [
            //new Canvas("left-warrior"),
            //new Canvas("curr-warrior"),
            //new Canvas("right-warrior")
        ];
        let page = this;
        $("#left").click(()=>page.left());
        
        this.draw();
    }
    
    left(){
        console.log(this);
        if(this.currIdx !== 0){
            this.currIdx--;
            this.draw();
        }
    }
    
    selectWarrior(name){
        //todo: skill selection
        this.teamWorkshop.push(name);
        this.options.splice(this.options.indexOf(name), 1);
        this.currIdx--;
        
        if(this.teamWorkshop.length === 3){
            let teamName = prompt("What do you want to call this team?");
            //save the team
            this.user.teams.push(new Team(teamName, this.teamWorkshop.map((name)=>{
                return new Warrior(name);
            })));
            console.log(this.user.teams);
            this.controller.setView(Controller.MAIN_MENU);
        } else {
            this.update();
        }
    }
    
    draw(){
        if(this.currIdx !== 0){
            let leftCard = new WarriorCard(new Warrior(this.options[this.currIdx - 1]));
            //leftCard.draw(this.canvases[0]);
        }
        
        let midCard = new WarriorCard(new Warrior(this.options[this.currIdx]));
        //midCard.draw(this.canvases[1]);
        
        if(this.currIdx !== this.options.length - 1){
            let rightCard = new WarriorCard(new Warrior(this.options[this.currIdx + 1]));
            //rightCard.draw(this.canvases[2]);
        }
    }
    
    selectWarrior1(name){
        this.setState({
            warrior1: name
        });
        console.log(name);
    }
    selectWarrior2(name){
        this.setState({
            warrior2: name
        });
        console.log(name);
    }
    selectWarrior3(name){
        this.setState({
            warrior3: name
        });
        console.log(name);
    }
}
