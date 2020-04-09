import {Stat} from "../warrior/stat.js";
import {Controller} from "../controller.js";
import {View} from "./view.js";
import {EventListener, EVENT_TYPE} from "../event/events.js";

export class BattlePage extends View{
    constructor(team1, team2){
        super();
        this.team1 = team1;
        this.team2 = team2;

        let alertLoss = (team)=>{
            alert(team.enemyTeam.name + " wins!");
            this.getController().setView(Controller.MAIN_MENU);
        };
        team1.addKoListener(alertLoss);
        team2.addKoListener(alertLoss);

        this.currTeam = null; //current team whose turn it is
        this.inAttackPhase = false;
    }

    linkToPage(){
        this.team1.enemyTeam = this.team2;
        this.team2.enemyTeam = this.team1;
        this.team1.init();
        this.team2.init();

        let hud;
        let id;
        let page = this;

        for(let i = 0; i < 3; i++){
            //team 1
            id = `t1-member-${i + 1}`;
            //               change this
            this.linkHud(id, this.team1.members[i]);
            this.linkSpecialMoveButton("t1-spec-" + (i + 1), this.team1.members[i]);

            //team 2
            id = `t2-member-${i + 1}`;
            //               change this
            this.linkHud(id, this.team2.members[i]);
            this.linkSpecialMoveButton("t2-spec-" + (i + 1), this.team2.members[i]);
        }

        $("#back-button").click(()=>{
            this.getController().setView(Controller.MAIN_MENU);
        });
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
            this.currTeam.active.heartCollect();
            this.attackPhaseFor();
        }
    }

    bomb(){
        if(!this.inAttackPhase){
            this.currTeam.active.bomb();
            this.attackPhaseFor();
        }
    }

    linkHud(id, warrior){
        let page = this;
        let sel = $("#" + id);
        sel.addClass("container-fluid");
        sel.click(()=>{
            page.setDataText(warrior);
            //console.log(warrior);
        });

        let row = $("<div></div>");
        row.addClass("row").addClass("h-100");
        sel.append(row);

        let icon = $("<div></div>").addClass("circle").addClass("col").css({
            "width": "50%",
            "height": "100%",
            "background-color": warrior.element.color
        });
        row.append(icon);
        icon.append(`<p>${warrior.name}</p>`);

        let right = $("<div></div>");
        right.addClass("col");
        row.append(right);

        let hpBar = $("<div></div>")
            .addClass("h-50")
            .css("background-color", "red")
            .text(warrior.getStatValue(Stat.HP));
        right.append(hpBar);

        let effectList = $("<ul></ul>");
        right.append(effectList);

        let updateHp = (event)=>{
            hpBar.css("width", `${warrior.getPercHPRem() * 100}%`).text(warrior.hpRem);
        };
        warrior.addEventListener(new EventListener(
            "update HP 1",
            EVENT_TYPE.warriorDamaged,
            updateHp
        ));
        warrior.addEventListener(new EventListener(
            "update HP 2",
            EVENT_TYPE.warriorHealed,
            updateHp
        ));
        warrior.addEventListener(new EventListener(
            "update UI on KO",
            EVENT_TYPE.warriorKOed,
            (koEvent)=>{
                sel.css("background-color", "black");
                sel.empty();
            }
        ));
        warrior.addEventListener(new EventListener(
            "refresh UI",
            EVENT_TYPE.warriorUpdated,
            (w)=>{
                effectList.empty();
                if(w.boostIsUp){
                    effectList.append("<li>Elemental Boost</li>");
                }
                if(w.shield){
                    effectList.append("<li>Phantom Shield</li>");
                }
                if (w.lastPhysDmg !== 0){
                    effectList.append(`<li>-${Math.round(w.lastPhysDmg)}`);
                }
                if (w.lastEleDmg !== 0){
                    effectList.append(`<li>-${Math.round(w.lastEleDmg)}`);
                }
                if (w.lastHealed !== 0){
                    effectList.append(`<li>+${Math.round(w.lastHealed)}`);
                }

                //ew. change this later
                hpBar.css("background-color", (w.poisoned !== false) ? "green" : "red");
            }
        ));
    }

    linkSpecialMoveButton(id, warrior){
        let page = this;
        $("#" + id)
            .addClass("owner-" + warrior.id)
            .text(warrior.special.name)
            .css("background-color", warrior.element.color)
            .click(()=>page.specialMove(warrior));
        warrior.addEventListener(new EventListener(
            "remove special button on KO",
            EVENT_TYPE.warriorKOed,
            (event)=>{
                $(".owner-" + event.warriorKOed.id).remove();
            }
        ));
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
        * Physical: ${warrior.getStatValue(Stat.PHYS)}\n
        * Elemental: ${warrior.getStatValue(Stat.ELE)}\n
        * Max HP: ${warrior.getStatValue(Stat.HP)}\n
        * Armor: ${warrior.getStatValue(Stat.ARM)}\n`);
    }

    recoverPhaseFor(){
        this.inAttackPhase = false;
        this.currTeam.isKoed();
        if(this.team1.won || this.team2.won){
            return;
        } //#################################STOPS HERE IF A TEAM WON

        $("#vs-text").text(`${this.currTeam.active.name} VS ${this.currTeam.enemyTeam.active.name}`);
        this.currTeam.forEach((member)=>member.clearHealingFlag());

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
    }
}
