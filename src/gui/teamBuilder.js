import {Warrior} from "../warrior/warrior.js";
import {Team} from "../warrior/team.js";
import {Stat} from "../warrior/stat.js";

export class TeamBuilder{
    constructor(user){
        this.user = user;
        this.options = user.warriors.map((arr)=>arr[0]);
        this.currIdx = Number.parseInt(this.options.length / 2);
        this.teamWorkshop = []; //team thus far
        
        let page = this;
        $("#left").click(()=>page.left());
        $("#right").click(()=>page.right());
        $("#select").click(()=>{
            page.selectWarrior(page.options[page.currIdx]);
        });
        this.updateWarriorCard();
    }
    
    left(){
        if(this.currIdx !== 0){
            this.currIdx--;
            this.updateWarriorCard();
        }
    }
    right(){
        if(this.currIdx !== this.options.length - 1){
            this.currIdx++;
            this.updateWarriorCard();
        }
    }
    
    selectWarrior(name){
        //todo: skill selection
        this.teamWorkshop.push(name);
        this.options.splice(this.options.indexOf(name), 1);
        this.currIdx--;
        
        $("#team").append(`<li>${name}</li>`);
        
        if(this.teamWorkshop.length === 3){
            let teamName = prompt("What do you want to call this team?");
            //save the team
            this.user.teams.push(new Team(teamName, this.teamWorkshop.map((name)=>{
                return new Warrior(name);
            })));
            console.log(this.user.teams);
            this.teamWorkshop.forEach((n)=>{
                this.options.push(n);
            });
            this.teamWorkshop.splice(0, 3);
            $("#team").empty();
        } 
        this.updateWarriorCard();
    }
    
    updateWarriorCard(){
        //update left
        if(this.currIdx !== 0){
            $("#left-warrior").text(this.options[this.currIdx - 1]);
        } else {
            $("#left-warrior").text("");
        }
        
        //update middle
        let w = new Warrior(this.options[this.currIdx]);
        w.calcStats();
        $("#warrior-card").css("background-color", w.element.color);
        
        $("#level").text(w.level);
        $("#name").text(w.name);
        $("#special").text(w.special.name + " " + w.pip);
        
        $("#phys").text(w.getStat(Stat.PHYS));
        $("#ele").text(w.getStat(Stat.ELE));
        $("#hp").text(w.getStat(Stat.HP));
        
        let arm;
        switch(w.getStat(Stat.ARM)){
            case 0:
                arm = "light";
                break;
            case 1:
                arm = "medium";
                break;
            case 2:
                arm = "heavy";
                break;
            default:
                console.error("Invalid armor value for warrior: " + w.getStat(Stat.ARM));
                console.error(w.getStat(Stat.ARM));
                break;
        }
        $("#arm").text(arm);
        
        //update right
        if(this.currIdx !== this.options.length - 1){
            $("#right-warrior").text(this.options[this.currIdx + 1]);
        } else {
            $("#right-warrior").text("");
        }
    }
}
