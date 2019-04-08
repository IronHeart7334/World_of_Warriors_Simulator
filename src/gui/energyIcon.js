import {GuiElement} from "./guiElement.js";

/*
 * Displays the energy for one team
 */
export class EnergyIcon extends GuiElement{
    constructor(){
        super();
        this.team = null;
        this.color = "white";
    }
    setTeam(team){
        this.team = team;
    }
    setColor(color){
        this.color = color;
    }
    draw(canvas){
        super.draw(canvas);
        if(this.team !== null){
            canvas.setColor(this.color);
            for(let i = 0; i < this.team.energy; i++){
                canvas.circle(this.x + i * 5, this.y, 5);
            }
        }
    }
};