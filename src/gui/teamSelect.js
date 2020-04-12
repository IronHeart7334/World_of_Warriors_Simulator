import {Controller} from "../controller.js";
import {View} from "./view.js";

export class TeamSelect extends View{
    constructor(user1, user2){
        super();
        this.player1 = user1;
        this.player2 = user2;
        this.team1 = null;
        this.team2 = null;
    }

    linkToPage(){
        let newEle;
        let sel = $("#player-1-teams");
        let ts = this;

        $("#back-button").click(()=>this.getController().setView(Controller.MAIN_MENU));
        $("#fight-button").click(()=>{
            this.getController().setView(Controller.BATTLE, {
                team1 : ts.team1,
                team2 : ts.team2
            });
        });

        //player 1
        sel.empty();
        let teams = this.player1.getAllTeams();
        teams.forEach((team)=>{
            newEle = $(`<button>${team.name}</button>`);
            newEle.click(()=>{
                ts.setTeam1(team);
            });
            sel.append(newEle);
        });
        this.setTeam1(teams[0]);

        //player 2
        sel = $("#player-2-teams");
        sel.empty();
        teams = this.player2.getAllTeams();
        teams.forEach((team)=>{
            newEle = $(`<button>${team.name}</button>`);
            newEle.click(()=>{
                ts.setTeam2(team);
            });
            sel.append(newEle);
        });
        this.setTeam2(teams[1]);
    }

    setTeam1(team){
        this.team1 = team;
        $("#team1").text(team.toString());
        if(this.team2 !== null){
            $("#header").empty().text(`${this.team1.name} VS ${this.team2.name}`);
        }
    }
    setTeam2(team){
        this.team2 = team;
        $("#team2").text(team.toString());
        if(this.team1 !== null){
            $("#header").empty().text(`${this.team1.name} VS ${this.team2.name}`);
        }
    }
};
