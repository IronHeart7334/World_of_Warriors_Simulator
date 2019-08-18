import {Canvas} from "./canvas.js";
import {Stat} from "../warrior/stat.js";

export class BattlePage{
    constructor(){
        this.team1 = null;
        this.team2 = null;
        this.currTeam = null; //current team whose turn it is
        this.inAttackPhase = false;
        this.repaintThese = []; //stuff to redraw
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
            page.draw();
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
            
            this.linkSpecialMoveButton("t1-spec-" + (i + 1), team1.members[i]);
            
            //team 2
            id = `t2-member-${i + 1}`;
            //                       change this
            hud = new WarriorHud(id, team2.members[i]);
            this.repaintThese.push(hud);
            $("#" + id).click(()=>{
                page.setDataText(team2.members[i]);
            });
            
            this.linkSpecialMoveButton("t2-spec-" + (i + 1), team2.members[i]);
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
        
        
        this.currTeam = (Math.random() >= 0.5) ? this.team1 : this.team2;
        this.attackPhaseFor(this.currTeam);
    }
    
    normalMove(){
        if(this.inAttackPhase){
            this.currTeam.active.useNormalMove();
            this.currTeam = this.currTeam.enemyTeam;
            this.recoverPhaseFor();
        }
    }
    
    specialMove(warrior){
        if(this.inAttackPhase){
            if(this.currTeam === warrior.team){
                warrior.useSpecial();
                this.currTeam = this.currTeam.enemyTeam;
                this.recoverPhaseFor();
            }
        }
    }
    
    heartColl(){
        if(!this.inAttackPhase){
            this.currTeam.active.nat_regen();
            this.attackPhaseFor();
        }
    }
    
    //move some of this to warrior
    bomb(){
        if(!this.inAttackPhase){
            let d = this.currTeam.active.perc_hp(0.15);
            this.currTeam.active.hp_rem -= d;
            if(this.currTeam.active.hp_rem <= 1){
                this.currTeam.active.hp_rem = 1;
            }
            this.currTeam.active.hp_rem = Math.round(this.currTeam.active.hp_rem);
            this.attackPhaseFor();
        }
    }
    
    linkSpecialMoveButton(id, warrior){
        let page = this;
        $("#" + id)
            .addClass("owner-" + warrior.id)
            .text(warrior.special.name)
            .css("background-color", warrior.element.color)
            .click(()=>page.specialMove(warrior));
        warrior.addKoListener((w)=>{
            $(".owner-" + w.id).remove();
        });
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
    
    updateSpecials(){
        $(".t1-spec").hide();
        $(".t2-spec").hide();
        if(!this.inAttackPhase){
            return;
        }
        
        if(this.currTeam === this.team1 && this.team1.energy >= 2){
            $(".t1-spec").show();
        } else if(this.currTeam === this.team2 && this.team2.energy >= 2){
            $(".t2-spec").show();
        }
    }
    
    setDataText(warrior){
        $("#data-text").empty().html(`${warrior.name}:\n
        * Special Move: ${warrior.special.name} ${warrior.pip}\n
        * Element: ${warrior.element.name}\n
        * Physical: ${warrior.getStat(Stat.PHYS)}\n
        * Elemental: ${warrior.getStat(Stat.ELE)}\n
        * Max HP: ${warrior.getStat(Stat.HP)}\n
        * Armor: ${warrior.getStat(Stat.ARM)}\n`);
    }
    
    recoverPhaseFor(){
        this.inAttackPhase = false;
        this.currTeam.check_if_ko();
        if(this.team1.won || this.team2.won){
            return;
        } //#################################STOPS HERE IF A TEAM WON
        
        $("#vs-text").text(`${this.currTeam.active.name} VS ${this.currTeam.enemyTeam.active.name}`);
        this.currTeam.forEach((member)=>member.reset_heal());
        
        $(".recover").show();
        $(".attack").hide();
        if (this.currTeam.active.healableDamage <= 0){
            //no damage to heal, so skip this phase
            this.attackPhaseFor();
        }
        this.draw();
    }
    
    attackPhaseFor(){
        this.inAttackPhase = true;
        
        this.currTeam.turn_part2(); //lots of non-GUI stuff done here
        $(".attack").show();
        $(".recover").hide();
        this.updateSpecials();
        
        this.draw();
    }
    
    draw(){
        this.updateEnergy();
        this.repaintThese.forEach((element)=>{
            element.draw();
        });
    }
}


class WarriorHud{
    constructor(elementId, warrior){
        this.warrior = warrior;
        this.canvas = new Canvas(elementId);
    }
    
    /*
     * I want to redo this so that text looks better.
     * Maybe incorperate multiple elements into the hud, 
     * not just a canvas?
     */
    draw(){
        let canvas = this.canvas;
        canvas.setColor("black");
        canvas.rect(0, 0, 100, 100); //clear the canvas
        
        if(this.warrior.check_if_ko()){
            return;
        }//########################################## STOPS HERE IF KOED
        
        //'active' border
        if(this.warrior.team.active === this.warrior){
            canvas.setColor("grey");
            canvas.rect(0, 0, 100, 100);
        }
        
        //boost
        if(this.warrior.boostIsUp){
            canvas.setColor(this.warrior.element.color);
            canvas.rect(0, 0, 100, 100 / 2);
        }
        
        //health bar
        let color;
        //I think I've just been poisoned...
        //ergh this is awful
        if(this.warrior.poisoned !== false){
            color = "green";
        } else {
            color = "red";
        }
        canvas.setColor(color);
        canvas.rect(50, 0, 50 * this.warrior.hp_perc(), 50);
        
        // health value
        canvas.text(50, 0, this.warrior.name);
        if (this.warrior.regen){
            canvas.text(50, 50, this.warrior.hp_rem + "+");
        } else {
            canvas.text(50, 50, this.warrior.hp_rem);
        }
        
        if (this.warrior.lastPhysDmg !== 0){
            canvas.text(50, 50, "-" + String(Math.round(this.warrior.lastPhysDmg)));
        }
        if (this.warrior.lastEleDmg !== 0){
            //make this text colored
            canvas.text(50, 50, "-" + String(Math.round(this.warrior.lastEleDmg)));
        }
        if (this.warrior.last_healed !== 0){
            canvas.text(50, 50, "+" + String(this.warrior.last_healed));
        }

        // Phantom Shield overlay
        if (this.warrior.shield){
            canvas.setColor("rgba(0, 0, 155, 0.5)");
            canvas.rect(0, 0, 100, 100 / 2);
        }

        // icon
        canvas.setColor(this.warrior.element.color);
        canvas.circle(0, 0, 50);
    }
}