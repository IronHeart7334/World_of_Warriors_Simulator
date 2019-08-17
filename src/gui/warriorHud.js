import {Canvas} from "./canvas.js";

export class WarriorHud{
    constructor(elementId, warrior){
        this.warrior = warrior;
        this.canvas = new Canvas(elementId);
    }
    
    draw(){
        let canvas = this.canvas;
        
        if(this.warrior.check_if_ko()){
            canvas.setColor("black");
            canvas.rect(0, 0, 100, 100);
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
        canvas.rect(5, 5, 15 * this.warrior.hp_perc(), 5);
        
        // health value
        canvas.text(10, 0, this.warrior.name);
        if (this.warrior.regen){
            canvas.text(10, 10, this.warrior.hp_rem + "+");
        } else {
            canvas.text(10, 10, this.warrior.hp_rem);
        }
        
        if (this.warrior.lastPhysDmg !== 0){
            canvas.text(10, 20, "-" + String(Math.round(this.warrior.lastPhysDmg)));
        }
        if (this.warrior.lastEleDmg !== 0){
            //make this text colored
            canvas.text(10, 30, "-" + String(Math.round(this.warrior.lastEleDmg)));
        }
        if (this.warrior.last_healed !== 0){
            canvas.text(10, 40, "+" + String(this.warrior.last_healed));
        }

        // Phantom Shield overlay
        if (this.warrior.shield){
            canvas.setColor("rgba(0, 0, 155, 0.5)");
            canvas.rect(0, 0, 100, 100 / 2);
        }

        // icon
        canvas.setColor(this.warrior.element.color);
        canvas.circle(0, 0, 5);
    }
}