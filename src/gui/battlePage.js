import {GamePane} from "./gamePane.js";
import {WarriorHud} from "./warriorHud.js";
import {Button} from "./button.js";

export class BattlePage extends GamePane{
    constructor(){
        super();
        this.team1 = null;
        this.team2 = null;
        this.team1Turn = true;
    }
    
    setTeams(team1, team2){
        this.team1 = team1;
        this.team2 = team2;
        team1.enemyTeam = team2;
        team2.enemyTeam = team1;
        team1.init_for_battle();
        team2.init_for_battle();
        
        let y = 0;
        let hud;
        team1.members_rem.forEach((member)=>{
            hud = this.hpButtonFor(member);
            hud.setPos(0, y);
            this.addChild(hud);
            y += 20;
        });
        
        y = 0;
        team2.members_rem.forEach((member)=>{
            hud = this.hpButtonFor(member);
            hud.setPos(80, y);
            this.addChild(hud);
            y += 20;
        });
        
        this.team1Turn = Math.random() >= 0.5;
        this.update();
        // [team whose turn it is].turn_part1();
        //make sure this does turns in a loop, else I'll be using recursion
    }
    
    hpButtonFor(warrior){
        //make class for this
        let ret = new WarriorHud(warrior);
        ret.addOnClick(()=>{
            //display_stats(warrior);
        });
        return ret;
    }
    
    update(){
        //more stuffs here
        this.draw();
    }
}