import {Controller} from "../controller.js";
import {View} from "./view.js";

export class TeamSelect extends View{
    constructor(user1, user2){
        super();
        this.player1 = user1;
        this.player2 = user2;
        this.team1 = null;
        this.team2 = null;
        let page = this;
        
    }
    
    linkToPage(){
        let newEle;
        let sel = $("#player-1-teams");
        let ts = this;
        
        $("#back-button").click(()=>this.getController().setView(Controller.MAIN_MENU));
        $("#fight-button").click(()=>{
            this.getController().setView(Controller.BATTLE);
            //set teams
        });
        
        //player 1
        sel.empty();
        this.player1.teams.forEach((team)=>{
            newEle = $(`<button>${team.name}</button>`);
            newEle.click(()=>{
                ts.setTeam1(team);
            });
            sel.append(newEle);
        });
        this.setTeam1(this.player1.teams[0]);
        
        //player 2
        sel = $("#player-2-teams");
        sel.empty();
        this.player2.teams.forEach((team)=>{
            newEle = $(`<button>${team.name}</button>`);
            newEle.click(()=>{
                ts.setTeam2(team);
            });
            sel.append(newEle);
        });
        this.setTeam2(this.player2.teams[1]);
    }
    
    setTeam1(team){
        this.team1 = team;
        $("#team1").text(team.getDesc());
        if(this.team2 !== null){
            $("#header").empty().text(`${this.team1.name} VS ${this.team2.name}`);
        }
    }
    setTeam2(team){
        this.team2 = team;
        $("#team2").text(team.getDesc());
        if(this.team1 !== null){
            $("#header").empty().text(`${this.team1.name} VS ${this.team2.name}`);
        }
    }
    
    //todo: make the battle use the selected teams
    fight(){
        if(this.team1 !== null && this.team2 !== null){
            window.location.href = "battle.html";
        } else {
            alert("both teams must be chosen before fighting");
        }
    }
};
