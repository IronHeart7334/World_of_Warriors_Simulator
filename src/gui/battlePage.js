import {GamePane} from "./gamePane.js";
import {WarriorHud} from "./warriorHud.js";
import {Button} from "./button.js";
import {Stat} from "../warrior/stat.js";

//repurpose this as backend
export class BattlePage{
    constructor(){
        this.team1 = null;
        this.team2 = null;
        this.team1Turn = true;
        this.vsText = ""; //display actives
        this.dataText = ""; //displays warrior data
        this.turnPart = 0;
        
        console.log(this);
    }
    
    setTeams(team1, team2){
        this.team1 = team1;
        this.team2 = team2;
        team1.enemyTeam = team2;
        team2.enemyTeam = team1;
        team1.init();
        team2.init();
        
        let y = 0;
        let hud;
        team1.forEach((member)=>{
            hud = this.hpButtonFor(member);
            hud.setPos(0, y);
            //this.addChild(hud);
            y += 20;
        });
        
        y = 0;
        team2.forEach((member)=>{
            hud = this.hpButtonFor(member);
            hud.setPos(80, y);
            //this.addChild(hud);
            y += 20;
        });
        
        
        this.team1Turn = Math.random() >= 0.5;
        this.turnPart = 1;
        this.update();
    }
    
    updateEnergy(){
        $(".team-1-energy").hide();
        $(".team-2-energy").hide();
        for(let i = 0; i < this.team1.energy; i++){
            $("#t1-energy-" + (i + 1)).show();
        }
        for(let i = 0; i < this.team2.energy; i++){
            $("#t2-energy-" + (i + 1)).show();
        }
    }
    
    hpButtonFor(warrior){
        let ret = new WarriorHud(warrior);
        ret.addOnClick(()=>{
            this.dataText = warrior.name + ":\n";
            this.dataText += "\tSpecial Move: " + warrior.special.name + " " + warrior.pip + "\n";
            this.dataText += "\tElement: " + warrior.element.name + "\n";
            this.dataText += "\tPhysical: " + warrior.getStat(Stat.PHYS) + "\n";
            this.dataText += "\tElemental: " + warrior.getStat(Stat.ELE) + "\n";
            this.dataText += "\tMax HP: " + warrior.getStat(Stat.HP) + "\n";
            this.dataText += "\tArmor: " + warrior.getStat(Stat.ARM) + "\n";
            this.update();
        });
        return ret;
    }
    
    heartCollectionFor(team){
        let ret = new Button("Heart Collection");
        ret.setColor("red");
        ret.setPos(40, 90);
        ret.setSize(10, 10);
        ret.addOnClick(()=>{
            team.active.nat_regen();
            this.turnPart2For(team);
        });
        return ret;
    }
    
    bombFor(team){
        let ret = new Button("Bomb");
        ret.setColor("black");
        ret.setPos(50, 90);
        ret.setSize(10, 10);
        ret.addOnClick(()=>{
            let d = team.active.perc_hp(0.15);
            team.active.hp_rem -= d;
            if(team.active.hp_rem <= 1){
                team.active.hp_rem = 1;
            }
            team.active.hp_rem = Math.round(team.active.hp_rem);
            
            this.turnPart2For(team);
        });
        return ret;
    }
    
    nmButtonFor(team){
        let ret = new Button("Normal Move");
        ret.setPos(45, 70);
        ret.setSize(10, 10);
        ret.setColor(team.active.element.color);
        ret.addOnClick(()=>{
            team.active.useNormalMove();
            this.team1Turn = !this.team1Turn;
            this.turnPart = 1;
            this.update();
        });
        return ret;
    }
    displaySpecialsFor(team){
        let ret = [];
        let offset = 0;
        let b;
        team.forEach((member)=>{
            b = new Button(member.special.name);
            b.setPos((team === this.team1) ? offset : 90 - offset, 70);
            b.setSize(10, 10);
            b.setColor(member.element.color);
            b.addOnClick(()=>{
                member.useSpecial();
                this.team1Turn = !this.team1Turn;
                this.turnPart = 1;
                this.update();
            });
            offset += 10;
            ret.push(b);
        });
        return ret;
    }
    
    purgeTempButtons(){
        if(this.heartCol){
            this.removeChild(this.heartCol);
            this.heartCol = null;
        }
        
        if(this.bomb){
            this.removeChild(this.bomb);
            this.bomb = null;
        }
        
        if(this.nm){
            this.removeChild(this.nm);
            this.nm = null;
        }
        
        if(this.specials){
            this.specials.forEach((button)=>{
                this.removeChild(button);
            });
            this.specials = null;
        }
    }
    
    //might want to move some of this back to team later
    turnPart1For(team){
        return;
        let c = this.controller.canvas;
        
        team.check_if_ko();
        if(this.team1.won || this.team2.won){
            return;
        } //#################################STOPS HERE IF A TEAM WON
        team.forEach((member)=>member.reset_heal());
        
        this.purgeTempButtons();
        
        this.vsText = team.active.name + " VS " + team.enemyTeam.active.name;
        
        if (team.active.healableDamage > 0){
			this.heartCol = this.heartCollectionFor(team);
            this.bomb = this.bombFor(team);
            this.addChild(this.heartCol);
            this.addChild(this.bomb);
		} else {
            this.turnPart2For(team); //recursive. Might not be good
        }
        this.draw();
    }
    
    turnPart2For(team){
        let c = this.controller.canvas;
        this.turnPart = 2;
        
        this.purgeTempButtons();
        
        team.turn_part2(); //lots of non-GUI stuff done here
        
        this.vsText = team.active.name + " VS " + team.enemyTeam.active.name;
        
        this.nm = this.nmButtonFor(team);
        this.addChild(this.nm);
        if(team.energy >= 2){
            this.specials = this.displaySpecialsFor(team);
            this.specials.forEach((button)=>this.addChild(button));
        }
        this.draw();
    }
    
    update(){
        //more stuffs here
        this.updateEnergy();
        if(this.team1Turn !== null && this.turnPart === 1){
            if(this.team1Turn){
                this.turnPart1For(this.team1);
            } else {
                this.turnPart1For(this.team2);
            }
        }
        this.updateEnergy();
        this.draw();
    }
    
    draw(){
        return;
        this.controller.canvas.text(20, 0, this.vsText);
        let i = 20;
        this.dataText.split("\n").forEach((line)=>{
            this.controller.canvas.text(20, i, line);
            i += 5;
        });
    }
}