import {GamePane} from "./gamePane.js";
import {WarriorHud} from "./warriorHud.js";
import {Button} from "./button.js";

export class BattlePage extends GamePane{
    constructor(){
        super();
        this.team1 = null;
        this.team2 = null;
        this.team1Turn = true;
        this.vsText = ""; //display actives
        this.dataText = ""; //displays warrior data
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
        let ret = new WarriorHud(warrior);
        ret.addOnClick(()=>{
            this.dataText = warrior.name + ":\n";
            this.dataText += "\tSpecial Move: " + warrior.special.name + " " + warrior.pip + "\n";
            this.dataText += "\tElement: " + warrior.element.name + "\n";
            this.dataText += "\tPhysical: " + warrior.get_phys() + "\n";
            this.dataText += "\tElemental: " + warrior.get_ele() + "\n";
            this.dataText += "\tMax HP: " + warrior.max_hp + "\n";
            this.dataText += "\tArmor: " + warrior.armor + "\n";
            this.update();
        });
        return ret;
    }
    
    //might want to move some of this back to team later
    turnFor(team){
        let c = this.controller.canvas;
        
        team.check_if_ko();
        if(this.team1.won || this.team2.won){
            return;
        } //#################################STOPS HERE IF A TEAM WON
        team.members_rem.forEach((member)=>member.reset_heal());
        
        
        c.setColor("blue");
        for(let i = 0; i < team.energy; i++){
            c.circle(i * 10, 90, 5);
        }
        
        c.setColor("red");
        for(let i = 0; i < team.enemyTeam.energy; i++){
            c.circle(100 - i * 10, 90, 5);
        }
        
        this.vsText = team.active.name + " VS " + team.enemyTeam.active.name;
        
        //team.turn_part1()
    }
    
    update(){
        //more stuffs here
        if(this.team1Turn !== null){
            if(this.team1Turn){
                this.turnFor(this.team1);
            } else {
                this.turnFor(this.team2);
            }
        }
        this.draw();
    }
    
    draw(){
        super.draw();
        this.controller.canvas.text(20, 0, this.vsText);
        let i = 20;
        this.dataText.split("\n").forEach((line)=>{
            this.controller.canvas.text(20, i, line);
            i += 5;
        });
    }
}