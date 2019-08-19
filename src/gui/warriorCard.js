import {Stat} from "../warrior/stat.js";

/*
 * just render this on HTML
 * 
 * Todo: make this divide into rows / cols so that it's easier to edit.
 * call a getCardDisplay method on each stat, item, leader skill, etc, and draw them on the card
 * 
 */
export class WarriorCard{
    constructor(warrior){
        this.warrior = warrior;
    }
    
    setWidth(w){
        this.setSize(w, w/2);
    }
    
    draw(canvas){
        canvas.setColor("black");
        canvas.rect(0, 0, 100, 100);
        if(this.warrior === null){
            return;
        }
        
        //background
        canvas.setColor("yellow");
        canvas.rect(0, 0, 100, 50);
        
        //foreground
        let fgShift = 5;
        canvas.setColor((this.warrior) ? this.warrior.element.color : "black");
        canvas.rect(fgShift, fgShift, 100 - fgShift * 2, 50 - fgShift * 2);
        
        //level shield thing. Redo later
        /*
        canvas.fillStyle = "rgb(255, 200, 125)";
        canvas.beginPath();
        canvas.moveTo(x + 25, y + 25);
        canvas.lineTo(x + 25 + w / 10, y + 25);
        canvas.lineTo(x + 25 + w / 10, y + 25 + h / 7);
        canvas.lineTo(x + 25 + w / 20, y + 25 + h / 4);
        canvas.lineTo(x + 25, y + 25 + h / 7);
        canvas.fill();
        */
        canvas.setColor("brown");
        canvas.rect(0, 0, 10, 10);
        
        // Level numerator
        canvas.text(5, 5, (this.warrior) ? this.warrior.level : 0);
        
        // Denominator later
        
        //stats
        canvas.setColor("white");
        if(this.warrior){
            this.warrior.calcStats();
        }
        let msgs = (this.warrior) ? [this.warrior.getStat(Stat.PHYS), this.warrior.getStat(Stat.ELE), this.warrior.getStat(Stat.HP)] : ["", "", ""];
        for(let i = 0; i < 3; i++){
            canvas.rect(
                    5, 
                    50 / 3 + i * 10,
                    20,
                    10
            );
            canvas.text(
                    5, 
                    50 / 3 + i * 10,
                    msgs[i]
            );
        }
        
        //Armor
        canvas.setColor("grey");
        for(let i = 0; this.warrior && i <= this.warrior.armor; i++){
            canvas.rect(
                    5 + i * 10,
                    40,
                    100 / 12,
                    50 / 6
            );
        }
        
        // Name
        canvas.text(
                10,
                5,
                (this.warrior) ? this.warrior.name : ""
        );

        // Special
        canvas.text(
                80,
                5,
                (this.warrior) ? this.warrior.special.name : ""
        );
    }   
}