import {GamePane} from "./gamePane.js";
import {WarriorHud} from "./warriorHud.js";
import {Button} from "./button.js";
import {Stat} from "../warrior/stat.js";

export class BattlePage{
    constructor(){
        this.team1 = null;
        this.team2 = null;
        this.team1Turn = true;
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
        
        
        this.team1Turn = Math.random() >= 0.5;
        this.inAttackPhase = true; 
        this.update();
    }
    
    normalMove(){
        if(this.inAttackPhase){
            if(this.team1Turn){
                this.team1.active.useNormalMove();
            }else{
                this.team2.active.useNormalMove();
            }
            this.team1Turn = !this.team1Turn;
            this.inAttackPhase = false;
            this.update();
        }
    }
    
    specialMove(warrior){
        if(this.inAttackPhase){
            //check if warrior is on the current team
            if(
                this.team1Turn && warrior.team === this.team1 || 
                !this.team1Turn && warrior.team === this.team2
            ){
                warrior.useSpecial();
                this.team1Turn = !this.team1Turn;
                this.inAttackPhase = false;
                this.update();
            }
        }
    }
    
    heartColl(){
        if(!this.inAttackPhase){
            if(this.team1Turn){
                this.team1.active.nat_regen();
                this.attackPhaseFor(this.team1);
            } else {
                this.team2.active.nat_regen();
                this.attackPhaseFor(this.team2);
            }
            console.log("heal");
        }
    }
    
    bomb(){
        if(!this.inAttackPhase){
            let team = (this.team1Turn) ? this.team1 : this.team2;
            
            let d = team.active.perc_hp(0.15);
            team.active.hp_rem -= d;
            if(team.active.hp_rem <= 1){
                team.active.hp_rem = 1;
            }
            team.active.hp_rem = Math.round(team.active.hp_rem);
            this.attackPhaseFor(team);
            
            console.log("boom!");
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
        
        if(this.team1Turn && this.team1.energy >= 2){
            $(".t1-spec").show();
        } else if(!this.team1Turn && this.team2.energy >= 2){
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
    
    recoverPhaseFor(team){
        this.inAttackPhase = false;
        team.check_if_ko();
        if(this.team1.won || this.team2.won){
            return;
        } //#################################STOPS HERE IF A TEAM WON
        
        $("#vs-text").text(`${team.active.name} VS ${team.enemyTeam.active.name}`);
        team.forEach((member)=>member.reset_heal());
        
        $(".recover").show();
        $(".attack").hide();
        if (team.active.healableDamage <= 0){
            //no damage to heal, so skip this phase
            this.attackPhaseFor(team); //recursive. Might not be good
        }
        this.draw();
    }
    
    attackPhaseFor(team){
        this.inAttackPhase = true;
        
        team.turn_part2(); //lots of non-GUI stuff done here
        $(".attack").show();
        $(".recover").hide();
        this.updateSpecials();
        
        this.draw();
    }
    
    update(){
        if(this.team1Turn !== null){
            let team = (this.team1Turn) ? this.team1 : this.team2;
            if(this.inAttackPhase){
                this.attackPhaseFor(team);
            } else {
                this.recoverPhaseFor(team);
            }
        }
        this.draw();
    }
    
    draw(){
        this.updateEnergy();
        this.repaintThese.forEach((element)=>{
            element.draw();
        });
    }
}