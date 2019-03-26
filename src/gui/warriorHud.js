import {GuiElement} from "./guiElement.js";

export class WarriorHud extends GuiElement{
    constructor(warrior){
        super();
        this.warrior = warrior;
        this.setSize(20, 20);
    }
    
    draw(canvas){
        super.draw(canvas);
        
        //'active' border
        if(this.warrior.team.active === this.warrior){
            canvas.setColor("grey");
            canvas.rect(this.x, this.y, this.w, this.h);
        }
        
        //boost
        if(this.warrior.boost_up){
            canvas.setColor(this.warrior.element.color);
            canvas.rect(this.x, this.y, this.w, this.h / 2);
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
        canvas.rect(this.x + 5, this.y + 5, 15 * this.warrior.hp_perc(), 5);
        
        // health value
        canvas.text(this.x + 10, this.y, this.warrior.name);
        if (this.warrior.regen){
            canvas.text(this.x + 10, this.y + 10, this.warrior.hp_rem);
        } else {
            canvas.text(this.x + 10, this.y + 10, this.warrior.hp_rem + "+");
        }
        
        if (this.warrior.last_phys_dmg !== 0){
            canvas.text(this.x + 10, this.y + 20, "-" + String(Math.round(this.warrior.last_phys_dmg)));
        }
        if (this.warrior.last_ele_dmg !== 0){
            canvas.text(this.x + 10, this.y + 30, "-" + String(Math.round(this.warrior.last_ele_dmg)));
        }
        if (this.warrior.last_healed !== 0){
            canvas.text(this.x + 10, this.y + 40, "+" + String(this.warrior.last_healed));
        }

        // Phantom Shield overlay
        if (this.warrior.shield){
            canvas.setColor("rgba(0, 0, 155, 0.5)");
            canvas.rect(this.x, this.y, this.w, this.h / 2);
        }

        // icon
        canvas.setColor(this.warrior.element.color);
        canvas.circle(this.x, this.y, 5);
    }
}