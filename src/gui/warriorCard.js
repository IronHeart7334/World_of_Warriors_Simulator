import {GuiElement} from "./guiElement.js";

/*
 * Todo: make this divide into rows / cols so that it's easier to edit.
 * call a getCardDisplay method on each stat, item, leader skill, etc, and draw them on the card
 * 
 */
export class WarriorCard extends GuiElement{
    constructor(x=0, y=0, w=0, warrior=null){
        super(x, y);
        this.setWidth(w);
        this.setWarrior(warrior);
    }
    
    setWidth(w){
        this.setSize(w, w/2);
    }
    
    setWarrior(warrior){
        this.warrior = warrior;
    }
    
    draw(canvas){
        super.draw(canvas);
        //background
        canvas.setColor("yellow");
        canvas.rect(this.x, this.y, this.w, this.h);
        
        //foreground
        let fgShift = this.w / 20;
        canvas.setColor((this.warrior) ? this.warrior.element.color : "black");
        canvas.rect(this.x + fgShift, this.y + fgShift, this.w - fgShift * 2, this.h - fgShift * 2);
        
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
        canvas.rect(this.x, this.y, 10, 10);
        
        // Level numerator
        canvas.text(this.x + 5, this.y + 5, (this.warrior) ? this.warrior.level : 0);
        
        // Denominator later
        
        //stats
        canvas.setColor("white");
        if(this.warrior){
            this.warrior.calcStats();
        }
        let msgs = (this.warrior) ? [this.warrior.phys, this.warrior.ele, this.warrior.max_hp] : ["", "", ""];
        for(let i = 0; i < 3; i++){
            canvas.rect(
                    this.x + this.w / 20, 
                    this.y + this.h / 3 + i * this.h / 5,
                    this.w / 5,
                    this.h / 5
            );
            canvas.text(
                    this.x + this.w / 20, 
                    this.y + this.h / 3 + i * this.h / 5,
                    msgs[i]
            );
        }
        
        //Armor
        canvas.setColor("grey");
        for(let i = 0; this.warrior && i <= this.warrior.armor; i++){
            canvas.rect(
                    this.x + this.w / 20 + i * this.width / 10,
                    this.y + this.h / 5 * 4,
                    this.width / 12,
                    this.h / 6
            );
        }
        
        // Name
        canvas.text(
                this.x + this.w / 10,
                this.y + 5,
                (this.warrior) ? this.warrior.name : ""
        );

        // Special
        canvas.text(
                this.x + this.w / 5 * 4,
                this.y + 5,
                (this.warrior) ? this.warrior.special.name : ""
        );
    }   
}