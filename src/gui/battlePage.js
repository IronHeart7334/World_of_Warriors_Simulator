import {GamePane} from "./gamePane.js";
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
        this.team1Turn = Math.random() >= 0.5;
        this.update();
        // [team whose turn it is].turn_part1(); 
    }
    
    hpButtonFor(warrior){
        let ret = new Button(""); //blank, as this is going to be invisible
        ret.setColor("rgb(0, 0, 0, 0)");
        ret.setSize(20, 20);
        ret.addOnclick(()=>{
            //display_stats(warrior);
        });
        return ret;
    }
    
    update(){
        let y = 0;
        let button;
        let c = this.controller.canvas;
        
        //oh wait, this all gets erased by draw()
        this.team1.members_rem.forEach((member)=>{
            button = this.hpButtonFor(member);
            button.setPos(0, y);
            
            //move this to Warrior later
            //'active' border
            if(team1.active === member){
                c.setColor("grey");
                c.rect(0, y, 20, 20);
            }
            //boost
            if(member.boost_up){
                c.setColor(member.element.color);
                c.rect(0, y, 20, 10);
            }
            
            //display_health(member);
            
            y += 20;
        });
        this.draw();
    }
}