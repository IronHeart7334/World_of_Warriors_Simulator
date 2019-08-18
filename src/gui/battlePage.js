import {GamePane} from "./gamePane.js";
import {WarriorHud} from "./warriorHud.js";
import {Button} from "./button.js";
import {Stat} from "../warrior/stat.js";

export class BattlePage{
    constructor(){
        this.team1 = null;
        this.team2 = null;
        this.team1Turn = true;
        this.vsText = ""; //display actives
        this.dataText = ""; //displays warrior data
        this.turnPart = 0;
        
        this.repaintThese = []; //stuff to redraw
        
        console.log(this);
    }
    
    setTeams(team1, team2){
        this.team1 = team1;
        this.team2 = team2;
        team1.enemyTeam = team2;
        team2.enemyTeam = team1;
        team1.init();
        team2.init();
        
        let hud;
        let id;
        let page = this;
        $(window).resize(()=>{
            this.draw();
        });
        
        //this is a mess.
        for(let i = 0; i < 3; i++){
            //team 1
            id = `t1-member-${i + 1}`;
            //                         change this
            hud = new WarriorHud(id, team1.members[i]);
            this.repaintThese.push(hud);
            $("#" + id).click(()=>{
                page.setDataText(team1.members[i]);
            });
            $("#t1-spec-" + (i + 1))
                .text(team1.members[i].special.name)
                .css("background-color", team1.members[i].element.color);
            
            //team 2
            id = `t2-member-${i + 1}`;
            //                       change this
            hud = new WarriorHud(id, team2.members[i]);
            this.repaintThese.push(hud);
            $("#" + id).click(()=>{
                page.setDataText(team2.members[i]);
            });
            $("#t2-spec-" + (i + 1))
                .text(team2.members[i].special.name)
                .css("background-color", team2.members[i].element.color);
        }
        
        $("#heart-coll").click(()=>{
            page.heartColl();
        });
        $("#bomb").click(()=>{
            page.bomb();
        });
        $("#nm-button").click(()=>{
            page.normalMove();
        });
        
        
        this.team1Turn = Math.random() >= 0.5;
        this.turnPart = 1;
        this.update();
    }
    
    normalMove(){
        if(this.turnPart === 1){
            //in heart collection phase, so do nothing
        } else {
            if(this.team1Turn){
                this.team1.active.useNormalMove();
            }else{
                this.team2.active.useNormalMove();
            }
            this.team1Turn = !this.team1Turn;
            this.turnPart = 1;
            this.update();
        }
    }
    
    heartColl(){
        if(this.turnPart === 2){
            //in choosing attack phase, so do nothing
        } else {
            if(this.team1Turn){
                this.team1.active.nat_regen();
                this.turnPart2For(this.team1);
            } else {
                this.team2.active.nat_regen();
                this.turnPart2For(this.team2);
            }
            console.log("heal");
        }
    }
    
    bomb(){
        if(this.turnPart === 2){
            //in choosing attack phase, so do nothing
        } else {
            let team = (this.team1Turn) ? this.team1 : this.team2;
            
            let d = team.active.perc_hp(0.15);
            team.active.hp_rem -= d;
            if(team.active.hp_rem <= 1){
                team.active.hp_rem = 1;
            }
            team.active.hp_rem = Math.round(team.active.hp_rem);
            this.turnPart2For(team);
            
            console.log("boom!");
        }
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
    
    //todo remove specials of KOed team members
    updateSpecials(){
        $(".t1-spec").hide();
        $(".t2-spec").hide();
        if(this.team1Turn && this.team1.energy >= 2){
            $(".t1-spec").show();
        } else if(!this.team1Turn && this.team2.energy >= 2){
            $(".t2-spec").show();
        }
    }
    
    setDataText(warrior){
        this.dataText = `${warrior.name}:\n
        * Special Move: ${warrior.special.name} ${warrior.pip}\n
        * Element: ${warrior.element.name}\n
        * Physical: ${warrior.getStat(Stat.PHYS)}\n
        * Elemental: ${warrior.getStat(Stat.ELE)}\n
        * Max HP: ${warrior.getStat(Stat.HP)}\n
        * Armor: ${warrior.getStat(Stat.ARM)}\n`;
        this.draw();
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
    
    //use this stuff
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
        return;
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
        team.check_if_ko();
        if(this.team1.won || this.team2.won){
            return;
        } //#################################STOPS HERE IF A TEAM WON
        team.forEach((member)=>member.reset_heal());
        
        this.purgeTempButtons();
        
        this.vsText = team.active.name + " VS " + team.enemyTeam.active.name;
        
        if (team.active.healableDamage > 0){
            //this.bomb = this.bombFor(team);
            //this.addChild(this.heartCol);
            //this.addChild(this.bomb);
		} else {
            this.turnPart2For(team); //recursive. Might not be good
        }
        this.draw();
    }
    
    turnPart2For(team){
        this.turnPart = 2;
        
        this.purgeTempButtons();
        
        team.turn_part2(); //lots of non-GUI stuff done here
        
        this.vsText = team.active.name + " VS " + team.enemyTeam.active.name;
        
        
        if(team.energy >= 2){
            
        }
        this.draw();
    }
    
    update(){
        //more stuffs here
        if(this.team1Turn !== null && this.turnPart === 1){
            if(this.team1Turn){
                this.turnPart1For(this.team1);
            } else {
                this.turnPart1For(this.team2);
            }
        }
        this.draw();
    }
    
    draw(){
        this.updateEnergy();
        this.updateSpecials(); //oh wait, don't put this here
        this.repaintThese.forEach((element)=>{
            element.draw();
        });
        
        $("#data-text").empty().html(this.dataText);
        
        return;
        this.controller.canvas.text(20, 0, this.vsText);
        let i = 20;
        this.dataText.split("\n").forEach((line)=>{
            this.controller.canvas.text(20, i, line);
            i += 5;
        });
    }
}