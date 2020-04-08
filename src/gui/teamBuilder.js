import {Warrior} from "../warrior/warrior.js";
import {Team} from "../warrior/team.js";
import {Stat} from "../warrior/stat.js";
import {Controller} from "../controller.js";
import {View} from "./view.js";

export class TeamBuilder extends View{
    constructor(user){
        super();
        this.user = user;
        this.warriorChoices = user.getAllWarriors();
        this.currIdx = Number.parseInt(this.warriorChoices.length / 2);
        this.teamWorkshop = []; //team thus far
    }

    linkToPage(){
        let page = this;
        $("#back-button").click(()=>{
            page.teamWorkshop = [];
            page.getController().setView(Controller.MAIN_MENU);
        });
        $("#left").click(()=>page.left());
        $("#right").click(()=>page.right());
        $("#select").click(()=>{
            page.selectWarrior(page.warriorChoices[page.currIdx]);
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
        if(this.currIdx !== this.warriorChoices.length - 1){
            this.currIdx++;
            this.updateWarriorCard();
        }
    }

    selectWarrior(warrior){
        //todo: skill selection
        this.teamWorkshop.push(warrior);
        this.warriorChoices.splice(this.warriorChoices.indexOf(warrior), 1);
        this.currIdx--;
        if(this.currIdx < 0){
            this.currIdx = 0;
        }

        $("#team").append(`<li>${warrior.name}</li>`);

        if(this.teamWorkshop.length === 3){
            let teamName = prompt("What do you want to call this team?");
            //save the team
            let newTeam = new Team(teamName, this.teamWorkshop.map((warrior)=>warrior.copy()));
            this.user.addTeam(newTeam);
            this.teamWorkshop = [];
            this.getController().setView(Controller.MAIN_MENU);
        }
        this.updateWarriorCard();
    }

    updateWarriorCard(){
        //update left
        if(this.currIdx !== 0){
            $("#left-warrior").text(this.warriorChoices[this.currIdx - 1].name);
        } else {
            $("#left-warrior").text("");
        }

        //update middle
        let w = this.warriorChoices[this.currIdx];
        w.calcStats();
        $("#warrior-card").css("background-color", w.element.color);

        $("#level").text(w.level);
        $("#name").text(w.name);
        $("#special").text(w.special.name + " " + w.pip);

        $("#phys").text(w.getStatValue(Stat.PHYS));
        $("#ele").text(w.getStatValue(Stat.ELE));
        $("#hp").text(w.getStatValue(Stat.HP));

        let arm;
        switch(w.getStatValue(Stat.ARM)){
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
                console.error("Invalid armor value for warrior: " + w.getStatValue(Stat.ARM));
                console.error(w.getStatValue(Stat.ARM));
                break;
        }
        $("#arm").text(arm);

        //update right
        if(this.currIdx !== this.warriorChoices.length - 1){
            $("#right-warrior").text(this.warriorChoices[this.currIdx + 1].name);
        } else {
            $("#right-warrior").text("");
        }
    }
}
